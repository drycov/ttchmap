

export default function (app) {
    app.route('/api/v1')
        .get((req, res) => {
            res.status(200).json({ status: 200, api: 'v1' });
        });
    app.route('/api/v1')
        .get((req, res) => {
            res.status(200).json({ status: 200, api: 'v1' });
        });
    app.route('/api/v1')
        .get((req, res) => {
            res.status(200).json({ status: 200, api: 'v1' });
        });
    app.route('/api/*').all((req, res) => {
        res.status(404).json({ status: 404, error: 'Not Found' });
    });
};
