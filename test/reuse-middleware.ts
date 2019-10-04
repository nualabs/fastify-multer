import assert from 'assert'

import { file, submitForm, fileSize } from './_util'
import multer from '../lib'
import FormData from 'form-data'
import path from 'path'

describe('Reuse Middleware', function() {
  let parser

  before(function(done) {
    parser = multer().array('them-files')
    done()
  })

  it('should accept multiple requests', function(done) {
    let pending = 8

    function submitData(fileCount) {
      const form = new FormData()

      form.append('name', 'Multer')
      form.append('files', '' + fileCount)

      for (let i = 0; i < fileCount; i++) {
        form.append('them-files', file('small0.dat'))
      }

      submitForm(parser, form, function(err, req) {
        assert.ifError(err)

        assert.equal(req.body.name, 'Multer')
        assert.equal(req.body.files, '' + fileCount)
        assert.equal(req.files.length, fileCount)

        req.files.forEach(function(f) {
          assert.equal(f.fieldname, 'them-files')
          assert.equal(f.originalname, 'small0.dat')
          assert.equal(f.size, fileSize(path.resolve(__dirname, `./files/${f.originalname}`)))
          assert.equal(
            f.buffer.length,
            fileSize(path.resolve(__dirname, `./files/${f.originalname}`)),
          )
        })

        if (--pending === 0) {
          done()
        }
      })
    }

    submitData(9)
    submitData(1)
    submitData(5)
    submitData(7)
    submitData(2)
    submitData(8)
    submitData(3)
    submitData(4)
  })
})
