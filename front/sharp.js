import sharp from 'sharp';
import fs from 'fs';

const img = './static/piedra.PNG';
const imgFile = fs.readFileSync(img);

const sizes = [48, 72, 96, 144, 192, 256, 384, 512];

for (const size of sizes) {
	sharp(imgFile)
		.resize(size, size, {
			fit: 'cover',
			position: 'top'
		})
		.toFile(`./static/piedra${size}.PNG`);
}
