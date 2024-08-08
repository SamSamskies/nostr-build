# nostr-build

Utilities for working with [nostr.build](https://nostr.build/) media.



## Example usage

```ts
import { uploadFile } from 'nostr-build'

await uploadFile({
    file, // file that was uploaded using an html input
    sign: (event) => window.nostr.signEvent(event), // using nip-07 ext signing function
})
```
