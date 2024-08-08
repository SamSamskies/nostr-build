import {
    readServerConfig,
    uploadFile as nostrToolsUploadFile,
    OptionalFormDataFields,
} from "nostr-tools/nip96";
import { getToken } from "nostr-tools/nip98";
import { EventTemplate, Event } from "nostr-tools/core";

type Sign = (event: EventTemplate) => Promise<Event>;

const getApiUrl = async () => {
    const { api_url: apiUrl } = await readServerConfig("https://nostr.build");

    return apiUrl;
};

interface UploadParams {
    file: File;
    options: OptionalFormDataFields;
    sign: Sign;
}

export const uploadFile = async ({ file, options, sign }: UploadParams) => {
    const apiUrl = await getApiUrl();
    const nip98AuthorizationHeader = await getToken(apiUrl, "POST", sign, true);

    return nostrToolsUploadFile(file, apiUrl, nip98AuthorizationHeader, options);
};
