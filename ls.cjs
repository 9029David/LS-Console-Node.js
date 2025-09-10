const fs = require('node:fs/promises')
const path = require('node:path')

const folder = process.argv[2] ?? '.'

async function ls (folder) {
    let files
    try {
        files = await fs.readdir(folder)
    } catch {
        console.error(`Error reading folder: '${folder}'`)
        process.exit(1)
    }  

    const filesPromises = files.map(async file => {
        const filePath = path.join(folder, file)
        let stats
        try {
            stats = await fs.stat(filePath) // información del archivo
        } catch (error) {
            console.error(`Error reading filePath: '${filePath}'`)
            process.exit(1)
        }

        const isDirectory = stats.isDirectory()
        const fileType = isDirectory ? '-d' : '-f'
        const fileSize = stats.size.toString()
        const fileModified = stats.atime.toLocaleString() 

        return `${fileType} ${file.padEnd(40)} ${fileSize.padStart(10)} ${fileModified.padStart(30)}`
    })

    const filesInfo = await Promise.all(filesPromises)
    filesInfo.forEach(fileInfo => console.log(`|${fileInfo}`))
}
ls(folder)