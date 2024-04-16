extends CharacterBody2D

@export var speed:int = 500  # Max movement speed
@export var jumpVelocity:int = -400
@export var acceleration: float = 300  # Adjust this value to control acceleration speed
@export var deceleration: float = 100  # Adjust this value to control deceleration speed
@export var jumpBufferTime: float = 0.2  # Adjust this value to control jump buffer time

# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")
var jumpBufferCountdown: float = 0

func _physics_process(delta):
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta

	# Handle jump.
	if Input.is_action_pressed("ui_accept"):
		if is_on_floor():
			velocity.y = jumpVelocity
		else:
			jumpBufferCountdown = jumpBufferTime

	if is_on_floor() and jumpBufferCountdown > 0:
		velocity.y = jumpVelocity

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	var direction = Input.get_axis("ui_left", "ui_right")
	if direction:
		# Increase velocity towards max speed with acceleration
		velocity.x = move_toward(velocity.x, direction * speed, acceleration * delta)
	else:
		# Decelerate towards zero with deceleration
		velocity.x = move_toward(velocity.x, 0, deceleration * delta)

	move_and_slide()

	# Decrease the jump buffer countdown.
	jumpBufferCountdown -= delta
