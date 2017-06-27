# #Install

```
npm install autogenapi
```


# #Usage

Write API describe like below in somewhere of file.
```
  /**
   *  @path /register
   *  @method post
   *  @desc some describe of this endpoint
   *  @title some title
   * 
   *  @param {String} name 
   *  @param {number} _id 
   *  @param {object} userInfo
   * 
   *  @return {number} resultCode
   *  @return {string} resultString
   *  
   *  
   */

```

then

```
gendoc <some file with api comment>
```