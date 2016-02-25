# node-weasyprint
*A wrapper for the WeasyPrint HTML to PDF converter*

__NOTE: Some of the code is copy-paste from [devongovett/node-wkhtmltopdf](https://github.com/devongovett/node-wkhtmltopdf).__

## Installation and requirements

Use `npm` to install this module:
```
npm install weasyprint
```

To use this module, you need to have [weasyprint](http://weasyprint.org/) command line tool installed on your system. If `weasyprint` command is not in your PATH, you can specify its location setting `weasyprint.command` property after requiring the module:
```javascript
const weasyprint = require('weasyprint')

weasyprint.command = '~/programs/weasyprint'
```

## Usage

## License

MIT
