// import "./sass/style.scss";
import pathParse from "path-parse";
import pathModule from "path";
// console.log(pathModule)

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
                // this.pathM("D:\\rat-folder2\\yarn.lock", "file");
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

            path.children.forEach(e => {
                if (e.type == "directory") {
                    const subFolder = document.createElement("div");
                    subFolder.classList.add("folder", "view-element");
                    subFolder.dataset.name = e.name;
                    subFolder.dataset.path = e.path;
                    subFolder.dataset.size = e.size;
                    subFolder.tabIndex = -1;
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
                    file.dataset.path = e.path;
                    file.dataset.size = e.size;
                    file.tabIndex = -1;
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
            i_Element.classList.add("bi", "bi-chevron-right");

            const folderSpan = document.createElement("span");
            folderSpan.classList.add("folderIcon")
            const folderIElement = document.createElement("i");
            folderIElement.classList.add("bi", "bi-folder-fill");

            span.appendChild(i_Element);
            folderSpan.appendChild(folderIElement);
            folder.querySelector("span.textElement").insertAdjacentElement("afterbegin", folderSpan);
            folder.querySelector("span.textElement").insertAdjacentElement("afterbegin", span);
        })

        files.forEach(file => {
            const span = document.createElement("span");
            span.classList.add("fileIcon");

            const i_Element = document.createElement("i");
            i_Element.classList.add("bi", "bi-file-fill");

            span.appendChild(i_Element);
            file.querySelector("span.textElement").insertAdjacentElement("afterbegin", span);
        })
    }

    _appendChild(elm) {
        this.rootElm.appendChild(elm);
    }

    _setInitialStyle(elm) {
        this.sizes = {
            caret: 12,
            folderIcon: 12,
            fileIcon: 12,
            gap: 3,
            totalFolderPadding: 3 + 12 + 3 + 12 + 3,
            totalFilePadding: 3 + 12 + 3

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
        document.head.insertAdjacentElement("beforeend", styleElement);

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

        folderIcons.forEach(icon => {
            const padding = parseInt(icon.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.folderIcon) - this.sizes.gap;
            icon.style.left = computeOffset + "px";
        })

        fileIcons.forEach(icon => {
            const padding = parseInt(icon.parentElement.style.paddingLeft)
            const computeOffset = (padding - this.sizes.folderIcon) - this.sizes.gap;
            icon.style.left = computeOffset + "px";
        })

        carets.forEach(caret => {
            const padding = parseInt(caret.parentElement.style.paddingLeft)
            const computeOffset = (padding - (this.sizes.caret * 2)) - (this.sizes.gap * 2);
            caret.style.left = computeOffset + "px";
        })
    }

    _setGutters(elm) {
        const folders = elm.querySelectorAll("div.folder.view-element");

        folders.forEach(folder => {
            folder.classList.toggle("active");
            // const folderTopOffset = folder.getBoundingClientRect();
            const folderTopOffset = getComputedStyle(folder).getPropertyValue("height");
            const caretOffset = folder.querySelector("span.textElement > span.caret");
            folder.style = `
            --top: ${folderTopOffset};
            --left: calc(${caretOffset.style.left} + ${caretOffset.getBoundingClientRect().width / 2}px);
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
        if (folders) {
            folders.forEach(folder => {
                const caret = folder.querySelector("span.textElement > span.caret");

                caret.addEventListener("click", () => {
                    this.toggleCaret(folder);
                    caret.parentElement.parentElement.classList.toggle("viewGutter");
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

                folder.addEventListener("mouseenter", () => {
                    if (!folder.classList.contains("viewGutter")) return;
                    if (!folder.classList.contains("rat-hovered")) {
                        folder.classList.add("rat-hovered")
                    }
                })
                folder.addEventListener("mouseleave", () => {
                    if (!folder.classList.contains("viewGutter")) return;
                    if (folder.classList.contains("rat-hovered")) {
                        folder.classList.remove("rat-hovered")
                    }
                })
            })
        }
    }

    toggleCaret(elm) {
        const i = elm.querySelector("span.textElement > span.caret > i.bi");
        if (i.classList.contains("bi-chevron-right")) {
            i.classList.toggle("bi-chevron-right");
            i.classList.toggle("bi-chevron-down");
        } else if (i.classList.contains("bi-chevron-down")) {
            i.classList.toggle("bi-chevron-right");
            i.classList.toggle("bi-chevron-down");
        }
        
    }

    pathMessage(path, msg, type) {
        console.log(pathModule);
        if (type == "file") {
            const files = this.elm.querySelectorAll("[data-path].file");
            files.forEach(file => {
                const dataPath = file.dataset.path;
                if (pathModule.normalize(dataPath) == pathModule.normalize(path)) {
                    // console.log(dataPath, path);
                    if (msg == "warning") {
                        file.classList.toggle("rat-warning");
                    } else if (msg == "success") {
                        file.classList.toggle("rat-success");
                    } else if (msg == "info") {
                        file.classList.toggle("rat-info");
                    } else if (msg == "notify") {
                        file.classList.toggle("rat-notify");
                    } else {
                        console.warn("Please give a message type.")
                    }
                }
            })
        } else if (type == "folder") {
            const folders = this.elm.querySelectorAll("[data-path].folder");
            folders.forEach(folder => {
                const dataPath = folder.dataset.path;
                if (pathModule.normalize(dataPath) == pathModule.normalize(path)) {
                    // console.log(dataPath, path);
                    if (msg == "warning") {
                        folder.classList.toggle("rat-warning");
                    } else if (msg == "success") {
                        folder.classList.toggle("rat-success");
                    } else if (msg == "info") {
                        folder.classList.toggle("rat-info");
                    } else if (msg == "notify") {
                        folder.classList.toggle("rat-notify");
                    } else {
                        console.warn("Please give a message type.")
                    }
                }
            })
        }
    }

}

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