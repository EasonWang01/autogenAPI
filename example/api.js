
   /**
    * host: 'localhost:3016'
    */



  /**
   *  @path /register
   *  @method post
   *  @desc 註冊使用，包含三個參數
   *  @title 註冊發送
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

  /**
   *  @path /register
   *  @method get
   *  @title 註冊資訊 
   *  @desc 我是註冊資訊，包含三個參數
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
  app.put('/rentfinish', authToken, (req, res) => {
    //console.log(req.body);
    let body = req.body;
    let comment = req.body.comment;
    //console.log(req.token);
    if (req.token.data._id === req.body.item.author_id) {
      //出租者
      Post.update({ _id: req.body.item._id }, {
        $set: {
          "rentedFinishInfo.Lessor": {
            comment,
            timestamp: Date.now()
          },
          status: '已還租'
        }
      }).then(d => {
        res.end("更新成功")
      }).catch(err => console.log(err));
    } else if (req.token.data._id === JSON.parse(req.body.item.lessee).lessee._id) {
      //承租者
      Post.update({ _id: req.body.item._id }, {
        $set: {
          "rentedFinishInfo.Lessee": {
            comment,
            timestamp: Date.now()
          },
          status: '已還租'
        }
      }).then(d => {
        res.end("更新成功")
      }).catch(err => console.log(err));
    }
  })



  /**
   *  @path /deleteItem
   *  @method get
   *  @desc 我是登入
   *  @title 刪除物品
   * 
   *  @param {String} name true
   *  @param {number} id true
   *  @return {number} resultCode
   *  
   *  
   */

  app.delete('/deleteItem/:_id', authToken, (req, res) => {
    Post.findOne({ _id: req.params._id, authorName: req.token.data.username }).remove()
      .then(() => {
        res.end('item removed')
      })
      .catch(err => {
        console.log(err);
        res.end('刪除錯誤');
      })
  })






}