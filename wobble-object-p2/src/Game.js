class Game extends Phaser.State {

   preload() { }

   create() {
      this.collision = false

      this.game.stage.backgroundColor = 0x999999
      this.game.physics.startSystem(Phaser.Physics.P2JS)
      this.game.physics.p2.gravity.y = 800
      this.game.physics.p2.restitution = 0.0;


      // Ground sprite
      this.ground = this.game.add.sprite(200, 160, null)
      this.game.physics.p2.enable(this.ground)
      this.ground.body.debug = true

      this.ground.body.clearShapes()
      this.ground.body.addRectangle(150, 10, 0, 0)
      this.ground.body.static = true


      // Object sprite
      this.object = this.game.add.sprite(200, 150, null)
      this.game.physics.p2.enable(this.object)
      this.object.body.debug = true

      this.object.body.clearShapes()
      this.object.body.addRectangle(13, 13, 0, 0)
      this.object.body.data.gravityScale = 0
     
      // Enable sensor
      this.object.body.data.shapes[0].sensor = true
      this.object.body.onBeginContact.add(this.contactStart, this, 0, this.object)
      this.object.body.onEndContact.add(this.contactEnd, this, 0, this.object)

      let time = 400 // in ms
      let shift = 10 // in px

      let tween = this.game.add.tween(this.object.body)
      tween.to({y:this.object.body.y - shift}, time, "Linear", false)
      tween.to({y:this.object.body.y}, time, "Linear", false)
      tween.yoyo().loop().start()
   }

   update() { }

   render() {
      this.game.debug.text('pos ' + this.object.body.y, 0, 22)
      this.game.debug.text('collision ' + this.collision, 0, 33)
   }

   contactStart() {
      this.collision = true
   }

   contactEnd() {
      this.collision = false

   }

}

export default Game
