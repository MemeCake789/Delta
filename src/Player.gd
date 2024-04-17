extends CharacterBody2D

@export var walkSpeed = 700
@export var runSpeed = 1200
@export var jumpVelocity:int = -1200
@export var walkAcceleration: int = 1000                  # Adjust this value to control acceleration when walking
@export var runAcceleration: int = 2000                   # Adjust this value to control acceleration when running
@export var deceleration: int = 1500                      # Adjust this value to control deceleration walkSpeed
@export var jumpBufferTime: float = 0.2                   # Adjust this value to control jump buffer time
@export var directionChangeAccelerationWalk: int = 2000   # Adjust this value to control acceleration when changing direction while walking
@export var directionChangeAccelerationRun: int = 3000    # Adjust this value to control acceleration when changing direction while running

var curentSpeed = 0
var previousDirection = 0 # Keep track of the previous direction

# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")
var jumpBufferCountdown: float = 0

func _physics_process(delta):
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta

	# Handle jump.
	if Input.is_action_pressed("jump"):
		if is_on_floor():
			velocity.y = jumpVelocity
		else:
			jumpBufferCountdown = jumpBufferTime

	if Input.is_action_pressed("run"):
		curentSpeed = runSpeed
		deceleration = 2500
	else:
		curentSpeed = walkSpeed
		deceleration = 1500

	if is_on_floor() and jumpBufferCountdown > 0:
		velocity.y = jumpVelocity

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

	if global_position.y > 3000:
		global_position.x = 0
		global_position.y = 0

	# Decrease the jump buffer countdown.
	jumpBufferCountdown -= delta

	# Update the previous direction
	previousDirection = direction
