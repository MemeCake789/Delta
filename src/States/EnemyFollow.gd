extends State
class_name EnemyFollow

var player : CharacterBody2D

@export var enemy : CharacterBody2D

func Enter():
	enemy.skew = 0
	player = get_tree().get_first_node_in_group("Player")
	print_rich("[color=red]Enter on EnemyFollow[/color]")
	
func Update(delta : float):
	print_rich("[color=red]Update on EnemyFollow[/color]")
	
func Physics_Update(delta : float):
	var direction = player.global_position - enemy.global_position
	print_rich("[color=red]Physics_Update on EnemyFollow[/color]")
	
	if Input.is_action_pressed("one"):
		Transitioned.emit(self, "idle")
