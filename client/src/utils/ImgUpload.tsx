export const checkImg = (file: File) => {
    let err = ''
    if(!file) return err = 'File không tồn tại'

    if(file.size > 1024 * 1024) //1mb
        err = "The largest image size is 1mb"

        return err
}

export const imageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "fx3wlpvw")
    formData.append("cloud_name", "dmq1ovnkw")

    const res = await fetch("https://api.cloudinary.com/v1_1/dmq1ovnkw/upload", {
        method: "POST",
        body: formData
    })

    const data = await res.json()
    return {public_id: data.public_id, url: data.secure_url}
}