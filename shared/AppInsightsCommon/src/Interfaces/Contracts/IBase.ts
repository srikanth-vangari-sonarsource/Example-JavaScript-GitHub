// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Data struct to contain only C section with custom fields.
 */
export interface IBase {

    /**
     * Name of item (B section) if any. If telemetry data is derived straight from this, this should be null.
     */
    baseType: string;
}
