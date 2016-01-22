class Game extends Phaser.State {
   preload() {
      this.game.load.spritesheet('player', '../res/sprites/player.png', 20, 30, 24)
   }

   create() {
      this.game.stage.backgroundColor = 0x999999

      this.playerMaterial = this.game.physics.p2.createMaterial()
      this.tileMaterial = this.game.physics.p2.createMaterial()

      this.game.physics.startSystem(Phaser.Physics.P2JS)
      this.game.physics.p2.gravity.y = 800

      // Create player and tile
      this.player = this.game.add.sprite(40,40, 'player')
      this.tile = this.game.add.sprite(90, 250, '')
      this.tile.visible = false

      this.game.physics.p2.enable([this.player, this.tile])

      // Build player physics
      this.player.body.clearShapes()
      this.player.body.addRectangle(0, 30, 0, 0)
      this.player.body.debug = true
      this.player.body.fixedRotation = true
      this.player.body.setMaterial(this.playerMaterial)
      this.player.body.mass = 100

      // Create sensors (left, right, ground)
      let groundSensor = this.player.body.addCircle(8, 0, 12)
      groundSensor.sensor = true
      groundSensor.name = 'groundSensor'
      let rightSensor = this.player.body.addRectangle(7, 20, 10, 0)
      rightSensor.sensor = true
      rightSensor.name = 'rightSensor'
      let leftSensor = this.player.body.addRectangle(7, 20, -10, 0)
      leftSensor.sensor = true
      leftSensor.name = 'leftSensor'

      // Build a random slope tile
      this.tile.body.clearShapes()
      this.tile.body.addPolygon( {} , 20,29,  0,70  ,  80,70  ,  80,0  )
      this.tile.body.debug = true
      this.tile.body.static = true
      this.tile.body.setMaterial(this.tileMaterial)

      // contact material between player and tile
      let contactMaterial = this.game.physics.p2.createContactMaterial(this.playerMaterial, this.tileMaterial)
      contactMaterial.friction = 1 // this one is to avoid slipping
      contactMaterial.restitution = 0 // to disable bouncing
      contactMaterial.frictionRelaxation = 1  
      contactMaterial.surfaceVelocity = 0
      contactMaterial.frictionStiffness = 1e8;
      contactMaterial.stiffness = 1e8

      // Event listener
      this.player.body.onBeginContact.add(this.begin, this, 0, this.player)
      this.player.body.onEndContact.add(this.end, this, 0, this.player)

      this.player.collision = {
         'right' : false,
         'left' : false,
         'ground' : false
      }

      // Controls
      this.cursors = this.game.input.keyboard.createCursorKeys()
      this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

   }

   begin(a,b,shape,d,e, player) {
      if (shape.name) {
         if (shape.name == 'groundSensor')
            player.collision.ground = true
         if (shape.name == 'rightSensor')
            player.collision.right = true
         if (shape.name == 'leftSensor') 
            player.collision.left = true
      }
   }

   end(a,b,shape,d,player) {
      if (shape.name) {
         if (shape.name == 'groundSensor')
            player.collision.ground = false
         if (shape.name == 'rightSensor')
            player.collision.right = false
         if (shape.name == 'leftSensor') 
            player.collision.left = false
      }
   }

   update() {
      if (this.player.body.velocity.y > -1 && this.player.body.velocity.y < 1) {
         this.player.body.velocity.y = 0
         this.player.body.velocity.x = 0
         this.player.collision.ground = true
      }

      if (!this.player.collision.left && this.cursors.left.isDown) {
         this.player.body.moveLeft(100)

      } else if (!this.player.collision.right && this.cursors.right.isDown) {
         this.player.body.moveRight(100)
      } else {
         this.player.body.velocity.x = 0
      }

      if (this.jumpButton.isDown && this.player.collision.ground) {
         this.player.body.moveUp(200)
      }
   }

   render() {
      this.game.debug.text('left ' + this.player.collision.left.toString(), 0, 11)
      this.game.debug.text('right ' + this.player.collision.right.toString(), 0, 22)
      this.game.debug.text('ground ' + this.player.collision.ground.toString(), 0, 33)
      
      this.game.debug.text('vX ' + this.player.body.velocity.x.toString(), 5, 44)
      this.game.debug.text('vY ' + this.player.body.velocity.y.toString(), 5, 55)
   }

}

export default Game
