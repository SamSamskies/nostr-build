# nostr-build
[![NPM](https://img.shields.io/npm/v/nostr-build.svg)](https://www.npmjs.com/package/nostr-build)

Utilities for working with [nostr.build](https://nostr.build/) media.

## Installation

Install the package with:

```bash
npm i nostr-build
# or
yarn add nostr-build
```

## Usage

- [uploadFile](#uploadFile) - Allows you to upload a file to nostr.build which complies with the [NIP-96](https://github.com/nostr-protocol/nips/blob/master/96.md) standard
- [deleteFile](#deleteFile) - Allows you to delete a file from nostr.build which complies complies with the [NIP-96](https://github.com/nostr-protocol/nips/blob/master/96.md) standard

### uploadFile

Allows you to upload a file to nostr.build which complies with the [NIP-96](https://github.com/nostr-protocol/nips/blob/master/96.md) standard.

```
{
    file: File; // The file to be uploaded, represented as a `File` object.
    options?: {
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
    sign: (event: EventTemplate) => Promise<Event> // nostr signing function;
}

@returns Promise<{
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
}>
```

Example:

```jsx
import { uploadFile } from "nostr-build";

export default function App() {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    console.log(
      await uploadFile({
        file,
        sign: (event) => window.nostr.signEvent(event),
      })
    );
  };

  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

```

### deleteFile

Allows you to delete a file from nostr.build which complies complies with the [NIP-96](https://github.com/nostr-protocol/nips/blob/master/96.md) standard

```
fileHashOrFileName: string; // The file hash for free accounts or file name for premium accounts.
sign: (event: EventTemplate) => Promise<Event> // nostr signing function

@returns Promise<any>
```

Example:

```js
import { deleteFile } from "nostr-build";

const fileName = 'exampleFileNameOnNostrBuild.jpg';
const sign = (event) => window.nostr.signEvent(event);

deleteFile(fileName, sign)
  .then(console.log)
  .catch(console.error);
```

