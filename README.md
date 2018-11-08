# Edaemon β

Edaemon is in eternal beta. I consider it stable enough for production (in fact
it is already being used) but beta will remain there.

## Installation

Please note that these instuctions as of time being are not compatible with
Windows. You may have some luck running them in the Windows 10 Linux shell
though.

  * Ensure that you have the [Google Cloud SDK](https://cloud.google.com/sdk/)
  and [Node](https://nodejs.org) installed.
  * Clone the master branch of this repository.
  * `gcloud app deploy ./app.yaml`
  * `gcloud datastore indexes create ./index.yaml`

If you encounter any problems, contact me via the methods listed
[here](https://paulsnar.lv).

## Contibution guidelines

  * [Follow](http://editorconfig.org) the [.editorconfig](./.editorconfig).
  * `# coding: utf-8` should be considered mandatory for Python files.
  * Try to keep everything fairly modularized and don't keep too big files.
  * Do by example.
  * Be nice, please.

## License

Edaemon is distributed under the BSD 3-Clause License. To learn more, refer to
[LICENSE.txt](./LICENSE.txt).
