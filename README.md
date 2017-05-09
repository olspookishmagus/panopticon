# panopticon

Hackerspace.gr web app

## run it locally

Use [npm](https://www.npmjs.com/) to install the necessary tools.

    npm -g install gulp-cli

Install all required packages.

    npm install

Finally use [gulp](http://gulpjs.com/) to run it.

    gulp run

## contribute

If you add a new frontend library you'll need bower.

    npm install -g bower

Check `bower.json` on how to add it and check in its main files. You can use gulp to do that.

    gulp build

And also test any code changes you do.

    gulp test

## license

This software is licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE).
