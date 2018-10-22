# md5-input-file

Calculate MD5 of attached files through input element.

## Usage

```sh
$ yarn
$ yarn start
```

## Simple example

```js
const file = document.getElementById('input').files[0];
const md5 = await getMD5(file);

console.log(md5);
```

## Reference

- https://qiita.com/sakamotoryouta/items/1fd3d842e33a58c573f0
