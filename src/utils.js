export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const updateImagesRandom = (game, arr) => {
  arr.forEach(element => {
    let rndFrame = game.rnd.integerInRange(0, element.frames)

    while (element.image.frame === rndFrame) {
      rndFrame = game.rnd.integerInRange(0, element.frames)
    }

    element.image.frame = rndFrame
  });
}
