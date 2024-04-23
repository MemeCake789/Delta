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
	var distance = enemy.global_position - player.global_position
	print_rich("[color=red]Physics_Update on EnemyFollow[/color]")
	
	if distance.length() > 200:
		Transitioned.emit(self, "idle")
