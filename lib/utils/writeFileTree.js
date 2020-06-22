/**
 * Copy from @vue/cli - 4.3.1
 */

const fs = require('fs')
const path = require('path')

function deleteRemovedFiles(directory, newFiles, previousFiles) {
	// get all files that are not in the new filesystem and are still existing
	const filesToDelete = Object.keys(previousFiles).filter(
		filename => !newFiles[filename]
	)

	// delete each of these files
	return Promise.all(
		filesToDelete.map(filename => {
			return fs.unlink(path.join(directory, filename), err => {
				throw err
			})
		})
	)
}

module.exports = async function writeFileTree(dir, files, previousFiles) {
	if (previousFiles) {
		await deleteRemovedFiles(dir, files, previousFiles)
	}
	Object.keys(files).forEach(name => {
		const filePath = path.join(dir, name)
		fs.mkdir(path.dirname(filePath), () =>
			fs.writeFileSync(filePath, files[name])
		)
	})
}
