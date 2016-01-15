var azure = require('azure-storage');
var blobSvc = azure.createBlobService();
var container = process.env.AZURE_STORAGE_CONTAINER || 'ftp';

var fs = {
  unlink: function(path, callback) {
    blobSvc.deleteBlobIfExists(container, path, callback);
  },

  readdir: function(path, callback) {
    if(process.env.WRITE_ONLY) {
      return callback(null, []);
    }

    blobSvc.listBlobsSegmented(container, null, function(err, res) {
      var files = [];
      if(res && res.entries) {
        files = res.entries.map(function(entry) { return entry.name.replace(path, ''); });
      }

      callback(err, files);
    });
  },

  mkdir: function(path, mode, callback) {
    console.log('################################');
    console.log('MKDIR not implemented!', arguments);
    console.log('################################');
    callback();
  },

  open: function(path, flags, mode, callback) {
    console.log('################################');
    console.log('OPEN not implemented!', arguments);
    console.log('################################');
    callback();
  },

  close: function(fd, callback) {
    console.log('################################');
    console.log('CLOSE not implemented!', arguments);
    console.log('################################');
    callback();
  },

  rmdir: function(path, callback) {
    console.log('################################');
    console.log('RMDIR not implemented!', arguments);
    console.log('################################');
    callback();
  },

  rename: function(oldPath, newPath, callback) {
    // get url
    // copy blob
    // delete original
    var source = blobSvc.getUrl(container, oldPath);
    blobSvc.startCopyBlob(source, container, newPath, function(err) {
      if(err) {
        throw new Error(err);
      }

      return fs.unlink(oldPath, callback);
    });
  },

  stat: function(path, callback) {
    blobSvc.getBlobProperties(container, path, function(err, res) {
      callback(err, {
        isDirectory: function() { return false; },
        size: res ? res.contentLength : 0,
        mtime: res ? res.lastModified : '',
        mode: ''
      });
    });
  },

  createWriteStream: function(path, options) {
    var stream = blobSvc.createWriteStreamToBlockBlob(container, path);
    process.nextTick(function() {
      stream.emit('open');
    });

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
