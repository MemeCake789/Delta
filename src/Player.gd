extends CharacterBody2D

## The main player class controled by the user
##
## Manages [b] movement, jumping, acceleration [/b], as well as the [b]camera and gun[/b] 
##


#class_name Player 

@export var health                       :     = 7               ## Heath of player. (Max = 10)
@export var walkSpeed                   :     = 700             ## Max speed while walking
@export var runSpeed                    :     = 1200            ## Max speed while running ( use [kbd]Shift[/kbd] )
@export var jumpVelocity                :     = -1000           ## Impulse of ground when jumping


var walkAcceleration                    :     = 2000            ## Acceleration speed when walking
var runAcceleration                     :     = 3000            ## Acceleration speed when running
var wallJumpPower                       :     = 700             ## Velocity power when jumping in air
var deceleration                        :     = 1700            ## Speed when decelerating
var jumpBufferTime                      :     = 0.2             ## Time form when another jump can be registered
var directionChangeAccelerationWalk     :     = 3000            ## Acceleration when changing direction while walking
var directionChangeAccelerationRun      :     = 4000            ## Acceleration when changing direction while running

var curentSpeed := 0          ## Current speed tracked in delta time       

## Force when pushing other bodies
## @deprecated
var push_force:  = 80.0            

##Keep track of the previous direction
## @deprecated
var previousDirection := 0    

## The gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")

# -----------------------------------@INPUT----------------------------------- #

func set_health(health_value:int):
	if health > 0 and health < 10:
		health = health_value

	
func _input(event):
	if Input.is_action_just_pressed("two"):
		set_health(health+1)
		if health > 10:
			health = 10

	if Input.is_action_just_pressed("one"):
		set_health(health-1)
		if health < 0:
			health = 0
				
	if Input.is_action_pressed("jump"):
		
		if is_on_floor():
			velocity.y = jumpVelocity
			
		if is_on_wall() and Input.is_action_pressed("move_right"):
			velocity.y = jumpVelocity
			velocity.x = -wallJumpPower
			
		if is_on_wall() and Input.is_action_pressed("move_left"):
			velocity.y = jumpVelocity
			velocity.x = wallJumpPower

	if Input.is_action_pressed("run"):
		curentSpeed = runSpeed
		deceleration = 2500
		
	else:
		curentSpeed = walkSpeed
		deceleration = 1500
		

			

# -----------------------------------@PROCESS----------------------------------- #

func _process(delta):
	pass
			

func _physics_process(delta):
	# Add the gravity.
	if not is_on_floor():
		velocity.y += gravity * delta
	
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
	# ^ old collision method ^ does not work well on bullets
	# I will just use default physycs for the player
	
	if global_position.y > 8000:
		global_position = Vector2.ZERO



	# Update the previous direction
	previousDirection = direction

