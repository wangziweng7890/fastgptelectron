const exportData = (data, fileName = `${new Date().toString()}.xlsx`, action = 'download') => {
  if (action === 'download') {
    const link = document.createElement('a')
    link.download = fileName
    link.style.display = 'none'
    const blob = new Blob([data])
    link.href = URL.createObjectURL(blob)
    console.log(URL.createObjectURL(blob))
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
  else {
    const blob = new Blob([data], {
      type: 'application/pdf;chartset=UTF-8',
    })
    const fileURL = URL.createObjectURL(blob)
    window.open(fileURL)
  }
}

const uploadFile = async (api, data) => {
  const formDataA = new FormData()
  Object.keys(data).forEach((key) => {
    formDataA.append(key, data[key])
  })
  const res = await api({
    params: data,
    config: {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    },
  })
  return res
}

const exportFile = async (api, data, filename) => {
  const res = await api({
    params: data,
    config: {
      responseType: 'blob',
    },
  })
  exportData(res, filename)
}

export {
  exportFile,
  uploadFile,
  exportData,
}
