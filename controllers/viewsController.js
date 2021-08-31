exports.getOverview = (req,res) => {
    res.status(200).render('overview', {
        title: 'All Vacations'
    });
};

exports.getVacation = (req,res) => {
    res.status(200).render('vacation', {
        title: 'Miami'
    });
};