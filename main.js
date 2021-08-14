import pathParse from "path-parse";

class RatFolder {
    constructor(rootElm = undefined, autoInit = true, path = undefined, type = "paths") {
        this.rootElm = rootElm;
        this.pathType = type;
        if (this.rootElm == undefined) throw new Error("No root element specified");

        if (autoInit) {
            this.define();
        } else if (!autoInit) {
            if (path != undefined && path instanceof Object && Object.keys(path).length != 0) {
                this.elm = this._parsePaths(path, document.createElement("div"));
                this._resolvePathElement(this.elm, path);
                this._addComputeElements(this.elm);
                this._appendChild(this.elm);
                this._setInitialStyle(this.elm);
                this._setComputedStyles(this.elm);
                this._addEvents(this.elm);
                this._setGutters(this.elm);
                // this.alert("D:\\rat-folder2\\yarn.lock", "file");
                // console.log(elm);

            }
        }
    }

    define() {
        console.log("define")
    }

    _parsePaths(path, elm) {
        // console.log(path);
        if (path.children) {
            // const folder = document.createElement("div");
            elm.classList.add("folder", "view-element");
            elm.dataset.name = path.name;
            elm.dataset.event = false;

            path.children.forEach(e => {
                if (e.type == "directory") {
                    const subFolder = document.createElement("div");
                    subFolder.classList.add("folder", "view-element");
                    subFolder.dataset.name = e.name;
                    subFolder.dataset.path = e.path.replaceAll("\\", "/");
                    subFolder.dataset["pathWindows"] = e.path;
                    subFolder.dataset.size = e.size;
                    subFolder.tabIndex = -1;
                    subFolder.dataset.event = false;
                    // subFolder.dataset.height = subFolder.offsetHeight;
                    // subFolder.dataset.width = subFolder.offsetWidth;
                    elm.appendChild(subFolder)

                    if (e.children) {
                        this._parsePaths(e, subFolder);
                    }
                }
            })

            path.children.forEach(e => {
                if (e.type == "file") {
                    const file = document.createElement("div");
                    file.classList.add("file", "view-element");
                    file.dataset.name = e.name;
                    file.dataset.extension = pathParse(e.path).ext;
                    if (file.dataset.title == file.dataset.extension) file.dataset.name = null;
                    file.dataset.path = e.path.replaceAll("\\", "/");
                    file.dataset["pathWindows"] = e.path;
                    file.dataset.size = e.size;
                    file.tabIndex = -1;
                    file.dataset.event = false;
                    elm.appendChild(file);
                }
            });

            // elm.appendChild(folder);
        }

        return elm;
    }

    _resolvePathElement(elm, path) {
        if (elm.classList.contains("folder")) {
            elm.classList.remove("folder");
            elm.classList.add("rat-tree");
            // elm.classList.add("rat-tree-root");
        }

        if (elm.classList.contains("view-element")) {
            elm.classList.remove("view-element");
        }

        elm.dataset.path = path.path;
        elm.dataset.size = path.size;

        let folders = elm.querySelectorAll("div.folder.view-element");
        let files = elm.querySelectorAll("div.file.view-element");

        folders.forEach(folder => {
            let folderName = folder.dataset.name;

            let spanTextElement = document.createElement("span");
            spanTextElement.classList.add("textElement");

            let spanLabelElement = document.createElement("span");
            spanLabelElement.classList.add("label");
            spanLabelElement.innerText = folderName;

            spanTextElement.appendChild(spanLabelElement);
            folder.insertAdjacentElement("afterbegin", spanTextElement);

        })

        files.forEach(file => {
            let fileName = file.dataset.name;
            let fileExtension = file.dataset.extension;

            let spanTextElement = document.createElement("span");
            spanTextElement.classList.add("textElement");

            let spanLabelElement = document.createElement("span");
            spanLabelElement.classList.add("label");
            spanLabelElement.innerText = fileName;

            spanTextElement.appendChild(spanLabelElement);
            file.insertAdjacentElement("afterbegin", spanTextElement);

        })
    }

    _addComputeElements(elm) {
        let folders = elm.querySelectorAll("div.folder.view-element");
        let files = elm.querySelectorAll("div.file.view-element");

        folders.forEach(folder => {
            const span = document.createElement("span");
            span.classList.add("caret");

            const i_Element = document.createElement("i");
            // i_Element.classList.add("bi", "bi-chevron-right");
            i_Element.classList.add("bi", "bi-caret-right-fill");

            const folderSpan = document.createElement("span");
            folderSpan.classList.add("folderIcon")
            const folderIElement = document.createElement("i");
            folderIElement.classList.add("bi", "bi-folder-fill");

            span.appendChild(i_Element);
            folderSpan.appendChild(folderIElement);

            if (!folder.querySelector('span.textElement > span.folderIcon')) {
                folder.querySelector("span.textElement").insertAdjacentElement("afterbegin", folderSpan);
            }

            if (!folder.querySelector("span.textElement > span.caret")) {
                folder.querySelector("span.textElement").insertAdjacentElement("afterbegin", span);
            }
        })

        files.forEach(file => {
            const span = document.createElement("span");
            span.classList.add("fileIcon");

            const i_Element = document.createElement("i");
            i_Element.classList.add("bi", "bi-file-earmark-fill");

            span.appendChild(i_Element);

            if (!file.querySelector("span.textElement > span.fileIcon")) {
                file.querySelector("span.textElement").insertAdjacentElement("afterbegin", span);
            }
        })
    }

    _appendChild(elm) {
        this.rootElm.appendChild(elm);
    }

    _setInitialStyle(elm, gap = 5) {
        this.sizes = {
            caret: 12,
            folderIcon: 12,
            fileIcon: 12,
            gap,
            totalFolderPadding: gap + 12 + gap + 12 + gap,
            totalFilePadding: gap + 12 + gap

        };

        if (elm.querySelector("div.folder.view-element")) {
            this.sizes.caret = parseInt(
                getComputedStyle(elm.querySelector("div.folder.view-element > span.textElement > span.caret"))
                    .getPropertyValue("font-size")
            ) || 12;
            this.sizes.folderIcon = parseInt(
                getComputedStyle(elm.querySelector("div.folder.view-element > span.textElement > span.folderIcon"))
                    .getPropertyValue("font-size")
            ) || 12;
        }

        if (elm.querySelector("div.file.view-element")) {
            this.sizes.fileIcon = parseInt(
                getComputedStyle(elm.querySelector("div.file.view-element > span.textElement > span.fileIcon"))
                    .getPropertyValue("font-size")
            ) || 12;
        }

        this.sizes.totalFolderPadding = (this.sizes.gap * 3) + (this.sizes.caret + this.sizes.folderIcon);
        this.sizes.totalFilePadding = (this.sizes.gap * 2) + (this.sizes.fileIcon);
        this.sizes.iconOffset = (this.sizes.totalFolderPadding - this.sizes.folderIcon) - this.sizes.gap;

        const styleElement = document.createElement("style");
        styleElement.id = "rat-tree-view-styling";

        const styleText = `
            div.tree-view-container div.folder.view-element > span.textElement {
                padding-left: ${this.sizes.totalFolderPadding}px;
                padding-right: ${this.sizes.totalFolderPadding}px;
            }
            
            div.tree-view-container div.folder.view-element > span.textElement > span.caret {
                left: ${this.sizes.gap}px;
            }

            div.tree-view-container div.folder.view-element > span.textElement > span.folderIcon {
                left: ${this.sizes.iconOffset}px;
            }

            div.tree-view-container div.file.view-element > span.textElement > span.fileIcon {
                left: ${this.sizes.iconOffset}px;
            }

            div.tree-view-container div.file.view-element > span.textElement {
                padding-left: ${this.sizes.totalFolderPadding}px;
                padding-right: ${this.sizes.totalFolderPadding}px;
            }
        `;

        styleElement.innerText = styleText;

        if (document.head.querySelector("style#rat-tree-view-styling")) {
            document.head.querySelector("style#rat-tree-view-styling").innerText = styleText;
        } else {
            document.head.insertAdjacentElement("beforeend", styleElement);
        }

        // console.log(this.sizes);

    }

    _setComputedStyles(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");
        const files = elm.querySelectorAll("div.file.view-element");
        const folderIcons = elm.querySelectorAll("span.folderIcon");
        const fileIcons = elm.querySelectorAll("span.fileIcon");
        const carets = elm.querySelectorAll("span.caret");

        folders.forEach(folder => {
            if (folder.parentElement.classList.contains("rat-tree")) {
                folder.querySelector("span.textElement").style.paddingLeft = this.sizes.totalFolderPadding + "px";
            } else if (folder.parentElement.classList.contains("folder")) {
                const padding = (folder.parentElement.querySelector("span.textElement").style.paddingLeft || this.sizes.totalFolderPadding);
                const computePadding = parseInt(padding) + this.sizes.folderIcon;
                folder.querySelector("span.textElement").style.paddingLeft = computePadding + "px";
            }
        })

        files.forEach(file => {
            if (file.parentElement.classList.contains("folder")) {
                const computePaddingFile = parseInt(file.parentElement.querySelector("span.textElement").style.paddingLeft) + this.sizes.folderIcon;
                const spanElement = file.querySelector("span.textElement");
                spanElement.style.paddingLeft = computePaddingFile + "px";
            }
        })

        // folderIcons.forEach(icon => {
        //     // if (icon.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
        //     const padding = parseInt(icon.parentElement.style.paddingLeft)
        //     const computeOffset = (padding - this.sizes.folderIcon) - (this.sizes.gap);
        //     icon.style.left = computeOffset + "px";
        // })

        folderIcons.forEach(icon => {
            if (icon.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(icon.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.totalFolderPadding) + (this.sizes.gap * 2) + this.sizes.folderIcon;
            icon.style.left = computeOffset + "px";
        })

        /*fileIcons.forEach(icon => {
            // if (icon.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(icon.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.folderIcon) - (this.sizes.gap);
            icon.style.left = computeOffset + "px";
        })*/

        fileIcons.forEach(icon => {
            if (icon.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(icon.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.totalFolderPadding) + (this.sizes.gap * 2) + this.sizes.folderIcon;
            icon.style.left = computeOffset + "px";
        })

        /*carets.forEach(caret => {
            if (caret.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(caret.parentElement.style.paddingLeft)
            const computeOffset = (padding - (this.sizes.caret * 2)) - (this.sizes.gap * 3);
            caret.style.left = computeOffset + "px";
        })*/

        carets.forEach(caret => {
            if (caret.parentElement.parentElement.parentElement.classList.contains("rat-tree-root")) return;
            const padding = parseInt(caret.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.totalFolderPadding) + this.sizes.gap;
            caret.style.left = computeOffset + "px";
        })
    }

    _setGutters(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");

        folders.forEach(folder => {
            folder.classList.toggle("active");
            // const folderTopOffset = folder.getBoundingClientRect();
            const folderTopOffset = getComputedStyle(folder).getPropertyValue("height");
            // const caretOffset = folder.querySelector("span.textElement > span.caret");
            const caretOffset = folder.querySelector("span.textElement > span.caret");
            folder.style = `
            --top: ${folderTopOffset};
            // --left: calc(${caretOffset.style.left} + ${caretOffset.getBoundingClientRect().width / 2}px);
            --left: calc(${parseInt(getComputedStyle(caretOffset).getPropertyValue("left"))}px + ${caretOffset.getBoundingClientRect().width / 2}px);
            `;
            // console.log(folderTopOffset);
            // folder.classList.toggle("active");
        })

        folders.forEach(folder => {
            folder.classList.toggle("active");
        })
    }

    _addEvents(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");
        const files = elm.querySelectorAll("div.file.view-element");
        // console.log(folders)
        if (folders) {
            folders.forEach(folder => {
                if (folder.dataset.event == "false") {
                    folder.dataset.event = true;
                    const caret = folder.querySelector("span.textElement > span.caret");

                    // caret.removeEventListener("click", () => {});
                    caret.addEventListener("click", () => {
                        this.toggleCaret(folder);
                        caret.parentElement.parentElement.classList.toggle("viewGutter");
                        caret.parentElement.parentElement.classList.toggle("rat-opened");
                        if (!caret.parentElement.parentElement.classList.contains("rat-hovered")) {
                            caret.parentElement.parentElement.classList.add("rat-hovered");
                        } else if (caret.parentElement.parentElement.classList.contains("rat-hovered")) {
                            caret.parentElement.parentElement.classList.remove("rat-hovered");
                        }

                        if (folder.children) {
                            for (let subFolder of folder.children) {
                                if (subFolder.classList.contains("folder")) {
                                    subFolder.classList.toggle("active")
                                }
                            }

                            for (let file of folder.children) {
                                if (file.classList.contains("file")) {
                                    file.classList.toggle("active");
                                }
                            }
                        };
                    })

                    // folder.removeEventListener("mouseenter", () => {});
                    folder.addEventListener("mouseenter", () => {
                        if (!folder.classList.contains("viewGutter")) return;
                        if (!folder.classList.contains("rat-hovered")) {
                            folder.classList.add("rat-hovered")
                        }
                    })

                    // folder.removeEventListener("mouseleave", () => {});
                    folder.addEventListener("mouseleave", () => {
                        if (!folder.classList.contains("viewGutter")) return;
                        if (folder.classList.contains("rat-hovered")) {
                            folder.classList.remove("rat-hovered")
                        }
                    })
                }
                
            })
        }

        if (files) {
            files.forEach(file => {
                // console.log(file)
                if (file.dataset.event == "false") {
                    file.dataset.event = true;

                    file.addEventListener("click", () => {
                        this.focusedFileElement = file;
                        files.forEach(file2 => {
                            file2.blur();
                            /*if (file2.classList.contains("rat-focused")) {
                                file2.classList.remove("rat-focused");
                            }*/
                        })
                        /*if (!file.classList.contains("rat-focused")) {
                            file.classList.add("rat-focused");
                        }*/

                        file.focus();

                        // console.log(this.focusedFileElement);
                    })
                }
            })
        }
        this.rootElm.dataset.loaded = true;
    }

    toggleCaret(elm) {
        const i = elm.querySelector("span.textElement > span.caret > i.bi");
        if (i.classList.contains("bi-caret-right-fill")) {
            i.classList.toggle("bi-caret-right-fill");
            i.classList.toggle("bi-caret-down-fill");
        } else if (i.classList.contains("bi-caret-down-fill")) {
            i.classList.toggle("bi-caret-right-fill");
            i.classList.toggle("bi-caret-down-fill");
        }
        
    }

    message(path, type) {
        if (!this.rootElm.dataset.loaded) return;
        const elm = this.elm;
        var targetElement;
        var className;
        var blinkInterval;

        if (type == "file") {
            const files = elm.querySelectorAll("[data-path].file");

            files.forEach(file => {
                const dataPath = file.dataset.path;
                if (dataPath == path) {
                    targetElement = file;
                }
            })
        }

        if (type == "folder") {
            const folders = elm.querySelectorAll("[data-path].folder");

            folders.forEach(folder => {
                const dataPath = folder.dataset.path;
                if (dataPath == path) {
                    targetElement = folder;
                }
            })
        }

        function blink(ms = 200) {
            if (!className) {
                console.warn("Please use a message method first");
                return
            }
            if (blinkInterval) clearInterval(blinkInterval);
            blinkInterval = setInterval(() => {
                targetElement.classList.toggle(className);
            }, ms)
        }

        function disposeBlink(e = false) {
            if (blinkInterval) {
                clearInterval(blinkInterval)
                blinkInterval = false;
                if (e) {
                    if (!targetElement.classList.contains(className)) {
                        targetElement.classList.add(className);
                    }
                } else if (!e) {
                    if (targetElement.classList.contains(className)) {
                        targetElement.classList.remove(className);
                    }
                }
            }
        }

        function turnOff() {
            if (targetElement) {
                if (targetElement.classList.contains(className)) {
                    targetElement.classList.remove(className)
                }
            }
        }

        function sendAlert() {
            className = "rat-alert";            
            targetElement.classList.toggle(className);
        }

        function sendWarn() {
            className = "rat-warning";            
            targetElement.classList.toggle(className);
        }

        function sendSuccess() {
            className = "rat-success";            
            targetElement.classList.toggle(className);
        }

        function sendInfo() {
            className = "rat-info";            
            targetElement.classList.toggle(className);
        }

        return {
            path,
            blink,
            disposeBlink,
            turnOff,
            sendAlert,
            sendWarn,
            sendSuccess,
            sendInfo
        }
    }

    refresh(eventAdder = true, elm = this.elm) {
        this._addComputeElements(elm);
        this._setComputedStyles(elm);
        // if (eventAdder == true) {
            this._addEvents(elm);
        // }
    }

    addFile(referencePath, referencePathType, config, type, cb) {
        if (referencePathType == "file") {
            if (type == "file") {
                const files = this.elm.querySelectorAll("[data-path].file");
                files.forEach(file => {
                    const parent = file.parentElement;
                    const src = file.dataset.path.replaceAll("\\", "/");

                    if (src == referencePath.replaceAll("\\", "/")) {
                        // console.log(file)
                        const name = config.name || null;
                        if (name == null) {
                            console.error("Please give a name for the file");
                            return;
                        }
                        const fileExtension = config.extension || null;

                        for (const children of parent.children) {
                            if (children.classList.contains("file")) {
                                if (children.dataset.name == name) {
                                    console.error("A file with same name exists.");
                                    return;
                                }
                            }
                        }

                        const fileElement = document.createElement("div");
                        fileElement.classList.add("file", "view-element");

                        if (parent.classList.contains("rat-opened")) {
                            fileElement.classList.add("active");
                        }

                        fileElement.dataset.name = name;
                        fileElement.dataset.extension = fileExtension;
                        fileElement.dataset.path = parent.dataset.path.replaceAll("/", "\\") + "\\" + name;
                        fileElement.tabIndex = -1;

                        const spanTextElement = document.createElement("span");
                        spanTextElement.classList.add("textElement");

                        const spanLabelElement = document.createElement("span");
                        spanLabelElement.classList.add("label");
                        spanLabelElement.innerText = name;

                        spanTextElement.appendChild(spanLabelElement);
                        fileElement.appendChild(spanTextElement);
                        parent.appendChild(fileElement)
                        this.refresh()
                        // console.log(file.parentElement.children)


                        const fileNames = [];
                        const sortedElements = [];
                        // fileNames.push(name)
                        for (const children of parent.children) {
                            if (children.classList.contains("file")) {
                                fileNames.push(children.dataset.name);
                                fileNames.sort();
                            }
                        }

                        fileNames.forEach(fileName => {
                            for (const children of parent.children) {
                                if (children.classList.contains("file") && children.dataset.name == fileName) {
                                    sortedElements.push(children.cloneNode(true));
                                    children.remove()
                                    // fileNames.sort();
                                }
                            }
                        })

                        sortedElements.forEach(elm => {
                            parent.appendChild(elm)
                        })

                        const condition = cb()

                        if (condition == false) {
                            console.log(false)
                            for (const children of parent.children) {
                                if (children.classList.contains("file") && children.dataset.path == fileElement.dataset.path) {
                                    children.remove();
                                }
                            }
                        }

                        // console.log(sortedElements)

                    }
                })
            } else if (type == "folder") {
                // console.log("sdgjlk")
                const files = this.elm.querySelectorAll("[data-path].file");
                files.forEach(file => {
                    const parent = file.parentElement;
                    const src = file.dataset.path.replaceAll("\\", "/");

                    if (src == referencePath.replaceAll("\\", "/")) {
                        // console.log(file);
                        const name = config.name;

                        for (const children of parent.children) {
                            if (children.classList.contains("folder")) {
                                if (name == children.dataset.name) {
                                    console.error("A folder with same name exists.");
                                    break;
                                }
                            }
                        }

                        const folderElement = document.createElement("div");
                        folderElement.classList.add("folder", "view-element");
                        folderElement.dataset.name = name;
                        folderElement.dataset.path = parent.dataset.path.replaceAll("/", "\\") + "\\" + name;
                        folderElement.tabIndex = -1;

                        const spanTextElement = document.createElement("span");
                        spanTextElement.classList.add("textElement");

                        const spanLabelElement = document.createElement("span");
                        spanLabelElement.classList.add("label");
                        spanLabelElement.innerText = name;

                        spanTextElement.appendChild(spanLabelElement);
                        folderElement.appendChild(spanTextElement);

                        if (parent.classList.contains("folder")) {
                            parent.querySelector("span.textElement").insertAdjacentElement("afterend", folderElement);
                            this.refresh();
                        } else {
                            parent.insertAdjacentElement("afterbegin", folderElement);
                            this.refresh();
                        }


                        var folderNames = [];
                        var folderElementNames = [];

                        for (const children of parent.children) {
                            if (children.classList.contains("folder")) {
                                folderNames.push(children.dataset.name);
                                folderNames.sort();
                            }
                        }

                        folderNames.forEach(folderName => {
                            for (const children of parent.children) {
                                if (children.classList.contains("folder")) {
                                    if (folderName == children.dataset.name) {
                                        folderElementNames.unshift(children.cloneNode(true));
                                        children.remove();
                                    }
                                }
                            }
                        })

                        folderElementNames.forEach(folderElementName => {
                            if (parent.classList.contains("folder")) {
                                folderElementName.dataset.event = false;
                                parent.querySelector("span.textElement").insertAdjacentElement("afterend", folderElementName);
                                this.refresh();
                            } else {
                                folderElementName.dataset.event = false;
                                parent.insertAdjacentElement("afterbegin", folderElementName);
                                this.refresh();
                            }
                        })
                    }
                })
            }
            
        } else if (referencePathType == "folder") {
            if (type = "file") {
                const folders = this.elm.querySelectorAll("[data-path].folder");
                folders.forEach(folder => {
                    const src = folder.dataset.path;
                    const files = folder.children;

                    if (referencePath == src) {
                        var sameFileName = false;
                        for (const file of files) {
                            const fileName = file.dataset.name;
                            if (file.classList.contains("file")) {
                                // console.log(fileName);
                                if (config.name == file.dataset.name) {
                                    console.error("A file with same name exists.");
                                    sameFileName = true;
                                }
                            }
                        }
                        if (sameFileName == true) return;

                        if (config.name == undefined || config.extension == undefined) {
                            if (!config.extension) console.warn("Please specify a file extension.");
                            if (!config.name) console.warn("Please specify a file name.");
                            return;
                        }

                        const configFileName = config.name;
                        const configFileExtension = config.extension;

                        const fileElement = document.createElement("div");
                        fileElement.classList.add("file", "view-element");

                        if (folder.classList.contains("rat-opened")) {
                            fileElement.classList.add("active");
                        }

                        fileElement.dataset.name = configFileName;
                        fileElement.dataset.extension = configFileExtension;
                        fileElement.dataset.path = folder.dataset.path.replaceAll("/", "\\") + "\\" + configFileName;
                        fileElement.tabIndex = -1;

                        const spanTextElement = document.createElement("span");
                        spanTextElement.classList.add("textElement");

                        const spanLabelElement = document.createElement("span");
                        spanLabelElement.classList.add("label");
                        spanLabelElement.innerText = configFileName;

                        spanTextElement.appendChild(spanLabelElement);
                        fileElement.appendChild(spanTextElement);
                        folder.appendChild(fileElement)
                        this.refresh()

                        var fileElementNames = [];
                        var elements = [];

                        for (const file of files) {
                            if (file.classList.contains("file")) {
                                fileElementNames.push(file.dataset.name);
                                fileElementNames.sort();
                            }
                        }

                        fileElementNames.forEach(name => {
                            for (const file of files) {
                                if (file.classList.contains("file") && file.dataset.name == name) {
                                    elements.push(file);

                                    /*if (folder.querySelector("span.textElement")) {
                                        folder.a
                                    }*/
                                }
                            }
                        })

                        // console.log(elements);
                        // console.log("ksdghjdfsh")

                    }
                })
            }
        }
    }

    _createFileElement(name, ext, path) {
        // console.log("element", name, ext, path);
        const fileElement = document.createElement("div");
        fileElement.classList.add("file", "view-element");
        fileElement.dataset.name = name;
        fileElement.dataset.extension = ext;
        fileElement.dataset.path = path;
        fileElement.dataset.pathWindows = path.replaceAll("/", "\\");
        fileElement.dataset.event = false;
        fileElement.tabIndex = -1;

        const spanTextElement = document.createElement("span");
        spanTextElement.classList.add("textElement");

        const spanLabelElement = document.createElement("span");
        spanLabelElement.classList.add("label");
        spanLabelElement.innerText = name;

        spanTextElement.appendChild(spanLabelElement);
        fileElement.appendChild(spanTextElement);

        return fileElement;
    }

    addFile2(referencePath, referencePathType, config, cb) {
        if (referencePathType == "file") {
            const newPath = referencePath.replaceAll("\\", "/");
            try {
                var file = this.elm.querySelector(`[data-path="${newPath}"].file`);

                this.elm.querySelectorAll(`[data-path].file`).forEach(elm => {
                    if (elm.dataset.path == newPath) {
                        file = elm;
                        // console.log(file)
                    }
                })

                if (file == null || undefined) {
                    console.warn(`Reference path(${referencePath}) cannot find the element.`);
                    return;
                };
                const { parentElement } = file;

                if (!config.name || !config.extension) {
                    console.warn("A file name or extension was not given. PLease specify it.");
                    return;
                }
                const configName = config.name;
                const configExtension = config.extension;

                const fileElement = this._createFileElement(configName, configExtension, parentElement.dataset.path + "/" + configName);

                if (parentElement.classList.contains("rat-opened")) {
                    fileElement.classList.add("active");
                }

                for (const children of parentElement.children) {
                    if (children.classList.contains("file") && fileElement.dataset.name == children.dataset.name) {
                        console.error("A file with same name exists.");
                        return;
                    }
                }

                const fileElementNames = [];
                fileElementNames.push(fileElement.dataset.name);

                for (const children of parentElement.children) {
                    if (children.classList.contains("file")) {
                        fileElementNames.push(children.dataset.name);
                        fileElementNames.sort();                        
                    }
                }

                const nextFileElementName = fileElementNames[fileElementNames.indexOf(fileElement.dataset.name) + 1];

                if (nextFileElementName != undefined) {
                    parentElement.querySelector(`[data-name="${nextFileElementName}"].file`)
                    .insertAdjacentElement("beforebegin", fileElement);
                    this.refresh();
                } else if (nextFileElementName == undefined) {
                    parentElement.appendChild(fileElement);
                    this.refresh();
                }

                // console.log(parentElement.querySelector(`[data-name="${nextFileElementName}"].file`))
                // console.log(fileElementNames, nextFileElementName);

            } catch (err) {
                // console.warn(`Reference path(${referencePath}) cannot find the element.`)
                console.log(err)
            }
        }
    }

}

/*
const fileNames = [];
fileNames.push(name)
for (const children of file.parentElement.children) {
    if (children.classList.contains("file")) {
        fileNames.push(children.dataset.name);
        fileNames.sort();
    }
}

for (const children of file.parentElement.children) {
    if (children.classList.contains("file") && children.dataset.name == fileNames[fileNames.indexOf(name) - 1]) {
        children.insertAdjacentElement("afterend", fileElement);
        this.refresh();
        break;
    }
}
*/


/* if (path.children) {
            // container.classList.add("container");

            const folder = document.createElement("div");
            folder.dataset.name = path.name;
            folder.dataset.type = path.type;
            folder.classList.add("directory", "view-element");
            path.children.forEach(e => {
                if (e.type == "file") return;
                const child = document.createElement("div");
                child.dataset.name = e.name;
                child.dataset.type = e.type;
                child.classList.add("directory", "view-element")
                folder.appendChild(child)
                if (e.children) {
                    this.parsePaths(e, child);
                }
            })

            path.children.forEach(e => {
                if (e.type == "directory") return
                const [filename] = e.name.split(".");
                const extensionName = pathModule.extname(e.path);
                // console.log(extensionName, filename)

                const child = document.createElement("div");
                child.dataset.name = filename || null;
                child.dataset.type = e.type;
                child.dataset.extension = extensionName;
                child.classList.add("file", "view-element")
                elm.appendChild(child)
                // if (e.children) {
                    this.parsePaths(e, child);
                // }
            })

            elm.appendChild(folder)
        } */