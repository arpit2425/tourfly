exports.overview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours'
  });
};
exports.tour = (req, res) => {
  res.status(200).render('tour', {
    title: 'Tour'
  });
};
