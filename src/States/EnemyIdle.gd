extends State
class_name EnemyIdle

var player : CharacterBody2D
@export var enemy : CharacterBody2D


func Enter():
	enemy.skew = 50
	player = get_tree().get_first_node_in_group("Player")
	print_rich("[color=blue]Enter on EnemyIdle[/color]")
	
func Update(delta : float):
	print_rich("[color=blue]Update on EnemyIdle[/color]")
	
func Physics_Update(delta : float):

	print_rich("[color=blue]Physics_Update on EnemyIdle[/color]")
	
	if Input.is_action_pressed("two"):
		Transitioned.emit(self, "follow")
	
	
