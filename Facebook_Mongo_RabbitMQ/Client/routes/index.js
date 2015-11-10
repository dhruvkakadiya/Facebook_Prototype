
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('signin', { title: 'Express' });
};