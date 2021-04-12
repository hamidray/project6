const Sauce = require('../models/sauce');
const fs = require('fs');



exports.createSauce = (req, res, next) => {
   req.body.sauce = JSON.parse(req.body.sauce);
   const url = req.protocol + '://' + req.get('host');
   const sauce = new Sauce({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + '/images/' + req.file.filename,
    heat:  req.body.sauce.heat,
    likes:0,
    dislikes:0,
    usersLiked:[],
    usersDisliked:[],
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id }); 
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
      sauce = {
    _id: req.params.id,  
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + '/images/' + req.file.filename,
    heat: req.body.sauce.heat,
    
   };
} else {
  sauce = {  
    _id: req.params.id,  
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    //imageUrl:  req.body.imageUrl,
    heat: req.body.heat,
    
  };
}
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
          Sauce.deleteOne({_id: req.params.id}).then(
            () => {
              res.status(200).json({
                message: 'Deleted!'
              });
            }
          ).catch(
            (error) => {
              res.status(400).json({
                error: error
              });
            }
          );
        });
      }
    );
  };
 
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


/////// Dislike & Like Function  Export///////



exports.likeOneSauce = (req, res, next) => {
   const sauceObjet = req.body.sauce;
   Sauce.updateOne({ _id: req.params.id },{$set: {
       likes: sauceObjet.likes,
       dislikes: sauceObjet.dislikes,
        usersDisliked: sauceObjet.usersDisliked,
        usersLiked: sauceObjet.usersLiked },
        _id: req.params.id
    })
   .then(() => res.status(200).json({ message: req.body.message}))
    .catch(error => res.status(400).json({ error: req.body.message }));
};


///exports.likeOneSauce = (req, res, next) => {///
  //Sauce.findOne({_id: req.params.id}).then(
    //  (sauce) => { 
  // let update = {};
 /// )}  
  
   /// Sauce.updateOne({ _id: req.params.id },update
  //  })
 ///   .then(() => res.status(200).json({ message: req.body.message}))
   // .catch(error => res.status(400).json({ error: req.body.message }));
///};