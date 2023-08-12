function removeCommentsMiddleware(req, res, next) {
  const originalRender = res.render;

  res.render = function (view, options, callback) {
      const defaultCallback = function (err, html) {
          if (err) {
              return callback(err, html);
          }

          // Удаление комментариев из HTML контента
          const cleanedHtml = html.replace(/<!--[\s\S]*?-->/g, '');

          // Отправка очищенного контента клиенту
          res.send(cleanedHtml);
      };

      // Проверка наличия callback вторым аргументом
      if (typeof options === 'function') {
          callback = options;
          options = {};
      }

      // Make sure callback is a function before using it
      if (typeof callback !== 'function') {
          callback = defaultCallback;
      }

      originalRender.call(this, view, options, callback);
  };

  next();
}

export default removeCommentsMiddleware;
