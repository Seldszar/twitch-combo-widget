#!/usr/bin/env node

const archiver = require("archiver");
const fs = require("fs");
const { name } = require("../package.json");

const archive = archiver("zip");
const archiveFile = `dist/${name}-v${process.argv[2]}.zip`;

archive.directory("dist/", false);
archive.pipe(fs.createWriteStream(archiveFile));
archive.finalize();
