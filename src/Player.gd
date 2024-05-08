extends CharacterBody2D

@export var walkSpeed : int = 700
@export var runSpeed : int = 1200
@export var jumpVelocity : int = -1000

var walkAcceleration: int = 2000                  # Adjust this value to control acceleration when walking
var runAcceleration: int = 3000                   # Adjust this value to control acceleration when running
var wallJumpPower:int = 700                       # Power when jumping off wall
var deceleration: int = 1700                      # Adjust this value to control deceleration walkSpeed
var jumpBufferTime: float = 0.2                   # Adjust this value to control jump buffer time
var directionChangeAccelerationWalk: int = 3000   # Adjust this value to control acceleration when changing direction while walking
var directionChangeAccelerationRun: int = 4000    # Adjust this value to control acceleration when changing direction while running

var curentSpeed = 0
var previousDirection = 0 # Keep track of the previous direction

# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

@export var health = 0

var push_force = 80.0



func jump():
	if Input.is_action_pressed("jump"):
		if is_on_floor():
			velocity.y = jumpVelocity
		if is_on_wall() and Input.is_action_pressed("move_right"):
			velocity.y = jumpVelocity
			velocity.x = -wallJumpPower
		if is_on_wall() and Input.is_action_pressed("move_left"):
			velocity.y = jumpVelocity
			velocity.x = wallJumpPower

func run():
	if Input.is_action_pressed("run"):
		curentSpeed = runSpeed
		deceleration = 2500
	else:
		curentSpeed = walkSpeed
		deceleration = 1500

func _process(delta):
	if Input.is_action_just_pressed("two"):
		health += 1
		if health > 10:
			health = 10

	if Input.is_action_just_pressed("one"):
		health -= 1
		if health < 0:
			health = 0

func _physics_process(delta):
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta


	jump()
	run()
	#var mousePosition = get_global_mouse_position()
	#
	#%Camera2D.

	
	# Get the input direction and handle the movement/deceleration.
	var direction = Input.get_axis("move_left", "move_right")
	
	if direction:
		# Check if the direction has changed
		if direction != sign(velocity.x):
			# Increase velocity towards max walkSpeed with directionChangeAcceleration
			if Input.is_action_pressed("run"):
				velocity.x = move_toward(velocity.x, direction * curentSpeed, directionChangeAccelerationRun * delta)
			else:
				velocity.x = move_toward(velocity.x, direction * curentSpeed, directionChangeAccelerationWalk * delta)
		else:
			# Increase velocity towards max walkSpeed with acceleration
			if Input.is_action_pressed("run"):
				velocity.x = move_toward(velocity.x, direction * curentSpeed, runAcceleration * delta)
			else:
				velocity.x = move_toward(velocity.x, direction * curentSpeed, walkAcceleration * delta)
	else:
		# Decelerate towards zero with deceleration
		velocity.x = move_toward(velocity.x, 0, deceleration * delta)

	move_and_slide()
	
	#for i in get_slide_collision_count():
		#var c = get_slide_collision(i)
		#if c.get_collider() is RigidBody2D:
			#c.get_collider().apply_central_impulse(-c.get_normal() * push_force)
	# ^ collision ^ does not work well on bullets
	if global_position.y > 8000:
		global_position = Vector2.ZERO



	# Update the previous direction
	previousDirection = direction

