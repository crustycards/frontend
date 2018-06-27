import fileSelect from 'file-select'

module.exports.upload = ({type, multiple = false}) => {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    return Promise.reject(new Error('Your browser does not support file uploading'))
  }

  return fileSelect({
    accept: type,
    multiple
  })
}

// TODO - Abstract away logic from FileList and File in convertToText

module.exports.convertToText = (data) => {
  if (data === undefined || data === null) {
    return undefined
  }

  if (data.constructor === FileList) {
    return Promise.all(
      Array.from(data).map(file => (
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (result) => {
            const text = result.currentTarget.result
            resolve({name: file.name, text})
          }
          reader.onerror = (err) => reject(err)
          reader.readAsText(file)
        })
      ))
    )
  }

  if (data.constructor === File) {
    const file = data
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (result) => {
        const text = result.currentTarget.result
        resolve({name: file.name, text})
      }
      reader.onerror = (err) => reject(err)
      reader.readAsText(file)
    })
  }
}
