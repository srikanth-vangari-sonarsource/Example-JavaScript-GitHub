// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IImportCheckRollupOptions, IEs3CheckRollupOptions } from "./es3/Interfaces";
import { es3Check } from "./es3/Es3Check";

function _escapeRegEx(str:string) {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}

export function importCheck(options:IImportCheckRollupOptions = {}) {
    let checkOptions:IEs3CheckRollupOptions = {
        ignoreDefault: true,
        keywords: []
    };

    // Don't allow importing from folders from a package
    checkOptions.keywords.push({
        funcNames: [ /import.*@microsoft\/[a-z\-]+\//gi ],
        errorMsg: "Importing this module has been blocked, you should be importing directly from the root of the package and not from a deployed file of the package - [%funcName%]",
        errorTitle: "Invalid Import detected"
    });

    // Check enum map lookups to ensure they are used correctly
    checkOptions.keywords.push({
        funcNames: [ /(\w[\d\w]*)\[\1\.(\w[\w\d]*)\]/g ],
        errorMsg: "Incorrect usage of an indexed map lookup detected - [%funcName%] you should use the enum name value as the lookup not the map name -- eg. Name[eName.xxxx]",
        errorTitle: "Incorrect usage of indexed map lookup"
    });


    for (let lp = 0; lp < ((options.exclude)||[]).length; lp++) {
        if (options.exclude) {
            checkOptions.keywords.push({
                // eslint-disable-next-line security/detect-non-literal-regexp
                funcNames: [ new RegExp("import[\\s]*(\\*|\\{[^\\}]*\\})[\\s]*from[\\s]*[\\'\\\"][^\\'\\\"]*" + _escapeRegEx(options.exclude[lp]) + "[\\'\\\"]", "gi") ],
                errorMsg: "Importing from this module has been blocked, you should be importing directly from the source file and not the main module index definition - [%funcName%]",
                errorTitle: "Invalid Import detected"
            });
        }
    }

    let plugin = es3Check(checkOptions);
    plugin.name = "ai-rollup-importcheck";

    return plugin
}