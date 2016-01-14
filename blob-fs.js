var azure = require('azure-storage');
var blobSvc = azure.createBlobService();
var nfs = require('fs');
var container = process.env.AZURE_STORAGE_CONTAINER || 'ftp';

console.log('using container', container);

var fs = {
  unlink: function(path, callback) {
    console.log('UNLINK not implemented!', arguments);
    callback();
  },

  readdir: function(path, callback) {
    console.log('readdir', path);
    blobSvc.listBlobsSegmented(container, null, function(err, res) {
      var files = [];
      if(res && res.entries) {
        files = res.entries.map(function(entry) { return entry.name.replace(path, ''); });
      }

      console.log('listBlobsSegmented', err, files);
      callback(err, files);
    });
  },

  mkdir: function(path, mode, callback) {
    console.log('MKDIR not implemented!', arguments);
    callback();
  },

  open: function(path, flags, mode, callback) {
    console.log('OPEN not implemented!', arguments);
    callback();
  },

  close: function(fd, callback) {
    console.log('CLOSE not implemented!', arguments);
    callback();
  },

  rmdir: function(path, callback) {
    console.log('RMDIR not implemented!', arguments);
    callback();
  },

  rename: function(oldPath, newPath, callback) {
    console.log('RENAME not implemented!', arguments);
    callback();
  },

  stat: function(path, callback) {
    // { mode, isDirectory(), size, mtime }
    blobSvc.getBlobProperties(container, path, function(err, res) {
      console.log('STAT', path, res);
      callback(err, { isDirectory: function() { return false; }, size: res.contentLength, mtime: res.lastModified, mode: '' });
    });
  },

  createWriteStream: function(path, options) {
    // createWriteStream: Returns a writable stream, requiring:
    // events: 'open', 'error', 'close'
    // functions: 'write'
    console.log('createWriteStreamToBlockBlob', arguments);
    var stream = blobSvc.createWriteStreamToBlockBlob(container, path);
    console.log('stream', stream);
    return stream;
  },

  createReadStream: function(path, options) {
    //createReadStream: Returns a readable stream, requiring:
    //events: 'error', 'data', 'end'
    //functions: 'destroy'
    console.log('reateReadStream', arguments);
    return blobSvc.reateReadStream(container, path);
    return null;
  }
}

module.exports = fs;
