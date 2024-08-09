import {
  readServerConfig,
  uploadFile as nostrToolsUploadFile,
  deleteFile as nostrToolsDeleteFile,
} from "nostr-tools/nip96";
import { getToken } from "nostr-tools/nip98";

/** Designates a verified event signature. */
export const verifiedSymbol = Symbol("verified");

export interface Event {
  kind: number;
  tags: string[][];
  content: string;
  created_at: number;
  pubkey: string;
  id: string;
  sig: string;
  [verifiedSymbol]?: boolean;
}

export type EventTemplate = Pick<
  Event,
  "kind" | "tags" | "content" | "created_at"
>;

/**
 * Represents the optional form data fields for file upload in accordance with NIP-96.
 */
export type OptionalFormDataFields = {
  /**
   * Specifies the desired expiration time of the file on the server.
   * It should be a string representing a UNIX timestamp in seconds.
   * An empty string indicates that the file should be stored indefinitely.
   */
  expiration?: string;

  /**
   * Indicates the size of the file in bytes.
   * This field can be used by the server to pre-validate the file size before processing the upload.
   */
  size?: string;

  /**
   * Provides a strict description of the file for accessibility purposes,
   * particularly useful for visibility-impaired users.
   */
  alt?: string;

  /**
   * A loose, more descriptive caption for the file.
   * This can be used for additional context or commentary about the file.
   */
  caption?: string;

  /**
   * Specifies the intended use of the file.
   * Can be either 'avatar' or 'banner', indicating if the file is to be used as an avatar or a banner.
   * Absence of this field suggests standard file upload without special treatment.
   */
  media_type?: "avatar" | "banner";

  /**
   * The MIME type of the file being uploaded.
   * This can be used for early rejection by the server if the file type isn't supported.
   */
  content_type?: string;

  /**
   * Other custom form data fields.
   */
  [key: string]: string | undefined;
};

/**
 * Type representing the response from a NIP-96 compliant server after a file upload request.
 */
export type FileUploadResponse = {
  /**
   * The status of the upload request.
   * - 'success': Indicates the file was successfully uploaded.
   * - 'error': Indicates there was an error in the upload process.
   * - 'processing': Indicates the file is still being processed (used in cases of delayed processing).
   */
  status: "success" | "error" | "processing";

  /**
   * A message provided by the server, which could be a success message, error description, or processing status.
   */
  message: string;

  /**
   * Optional. A URL provided by the server where the upload processing status can be checked.
   * This is relevant in cases where the file upload involves delayed processing.
   */
  processing_url?: string;

  /**
   * Optional. An event object conforming to NIP-94, which includes details about the uploaded file.
   * This object is typically provided in the response for a successful upload and contains
   * essential information such as the download URL and file metadata.
   */
  nip94_event?: {
    /**
     * A collection of key-value pairs (tags) providing metadata about the uploaded file.
     * Standard tags include:
     * - 'url': The URL where the file can be accessed.
     * - 'ox': The SHA-256 hash of the original file before any server-side transformations.
     * Additional optional tags might include file dimensions, MIME type, etc.
     */
    tags: Array<[string, string]>;

    /**
     * A content field, which is typically empty for file upload events but included for consistency with the NIP-94 structure.
     */
    content: string;
  };
};

export type Sign = (event: EventTemplate) => Promise<Event>;

const getApiUrl = async () => {
  const { api_url: apiUrl } = await readServerConfig("https://nostr.build");

  return apiUrl;
};

export interface UploadParams {
  file: File;
  options?: OptionalFormDataFields;
  sign: Sign;
}

export const uploadFile = async ({
  file,
  options,
  sign,
}: UploadParams): Promise<FileUploadResponse> => {
  const apiUrl = await getApiUrl();
  const nip98AuthorizationHeader = await getToken(apiUrl, "POST", sign, true);

  return nostrToolsUploadFile(file, apiUrl, nip98AuthorizationHeader, options);
};

/**
 * Pass in file hash for free accounts or file name for premium accounts.
 */
export const deleteFile = async (fileHashOrFileName: string, sign: Sign) => {
  const apiUrl = await getApiUrl();
  const nip98AuthorizationHeader = await getToken(
    `${apiUrl}/${fileHashOrFileName}`,
    "DELETE",
    sign,
    true,
  );

  return nostrToolsDeleteFile(
    fileHashOrFileName,
    apiUrl,
    nip98AuthorizationHeader,
  );
};
