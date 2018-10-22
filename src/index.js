import md5 from 'js-md5';

const eOutput = document.getElementById('root');
const eHolder = document.getElementById('holder');

const CHUNK_SIZE = 102400; // 10KB

const displayFile = (file, md5) => {
  eOutput.innerText = `
  * name: ${file ? file.name : '-'}
  * size: ${file ? file.size : '-'}
  * md5: ${md5 || '-'}
  * lastModified: ${file ? file.lastModified : '-'}
  `;
};

const getMD5 = file => new Promise((resolve, reject) => {
  if (!file) {
    return reject('No file');
  }

  const hash = md5.create();
  let offset = 0;

  const blockRead = _offset => {
    const blob = file.slice(_offset, CHUNK_SIZE + _offset);

    const fileReader = new FileReader();
    fileReader.onloadend = event => {
      const result = new Uint8Array(event.target.result);

      if (event.target.error) {
        return reject('Failed to read file');
      }

      offset += result.length;
      hash.update(result);

      if (offset >= file.size) {
        console.log('Succeeded to read file');
        return resolve(hash.hex());
      }
      blockRead(offset);
    };

    fileReader.readAsArrayBuffer(blob);
  };

  blockRead(offset);
});

eHolder.addEventListener('change', async event => {
  const file = eHolder.files[0];
  displayFile(file);
  console.time('md5');
  const md5 = await getMD5(file).catch(e => {
    console.log(e);
    return 'Error';
  });
  console.timeEnd('md5');
  displayFile(file, md5);
},false);

displayFile();
