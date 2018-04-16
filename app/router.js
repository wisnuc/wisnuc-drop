

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  // user
  router.get('/', controller.user.index)

  // ticket
  // box
  // station
  // tweet
}
