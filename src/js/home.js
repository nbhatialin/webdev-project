import React from "react";
import ReactDOM from "react-dom";

const app = document.getElementById('app');
import Celebrity from "./Celebrity";
import Highscore from "./Highscore";

var celeb_url = "https://feedtherock.herokuapp.com/api/getThreeCelebrities";

class Main extends React.Component {
	constructor() {
		super();
		this.state = {
			value : 0,
			celebs : undefined,
			gamestate : 1,
			celeb_to_pass : undefined,
			difficulty : undefined,
			currentDisplay : true,
			score : 0
		}
	}

	
	processScore(score){
		this.setState({score : this.state.score + score});
		if(this.state.value + 1 == 3){
			this.state.gamestate = 3;
		}
		else {
			this.setState({value : this.state.value + 1});
			var nextval = this.state.value + 1;
			this.setState({celeb_to_pass : this.state.celebs[nextval]});
		}
		
	}

	render() {
		if(this.state.gamestate == 1 || this.state.gamestate == 3){
			return (
				<div>
				<img src="backgroundimages/homebackground.jpg" id="homebackground" />
				<h2 class="textcenter"> Feed the Rock </h2>
				<h3 class="textcenter"> The game of portion control </h3>
				<h4 class="textcenter_italic">  Can you restrain yourself? </h4>
					<select class="gobuttoncenter btn-hg textcenter" required id="selected"> 
						<option value="Easy" class="textcenter"> Easy </option>
						<option value="Medium" class = "textcenter"> Medium </option>
						<option value="Hard" class="textcenter"> Hard </option> 
					</select>
				<button class="gobuttoncenter btn-info btn-hg" onClick={function(){

					var x = document.getElementById(selected.value);
					this.setState({difficulty : selected.value});

					//get local storage - celebrities used in past game
					var storage = window.localStorage;
					var celebs = storage.getItem("celebs");
					if (celebs == null || celebs == undefined){
						celebs = ["", "", ""]; //empty strings
					}

					$.get(celeb_url, {celeb1: celebs[0], celeb2: celebs[1], celeb3: celebs[2]}, function(obj, err){
							this.setState({celebs : obj});
							this.setState({celeb_to_pass : obj[0]});
							this.setState({gamestate : 2});

							//set local storage - for next game
							storage.removeItem("celebs");
							var celebArray = [];
							celebArray.push(obj[0].name);
							celebArray.push(obj[1].name);
							celebArray.push(obj[2].name);
							storage.setItem("celebs", celebArray);
					}.bind(this));
				}.bind(this)} > Start </button>
				</div>
			);
		}
		if(this.state.gamestate == 2){
			return (
				<div>
				<audio autoPlay>
						<source src="audio/cooking.mp3" type="audio/mpeg"></source>
					</audio>

				<div class = "score">Score {this.state.score}</div>

				<Celebrity setScore = {this.processScore.bind(this)} imageLink = {this.state.celeb_to_pass.imageLink} age = {this.state.celeb_to_pass.age}
				height = {this.state.celeb_to_pass.height} weight = {this.state.celeb_to_pass.weight}
				name = {this.state.celeb_to_pass.name} gender = {this.state.celeb_to_pass.gender}
				isVegan = {this.state.celeb_to_pass.isVegan} isVegetarian = {this.state.celeb_to_pass.isVegetarian}
				isGlutenFree = {this.state.celeb_to_pass.isGlutenFree} partyLevel = {this.state.celeb_to_pass.partyLevel}
				exerciseLevel = {this.state.celeb_to_pass.exerciseLevel} difficulty = {this.state.difficulty}/>
				</div>
			);
		}
	}
}

ReactDOM.render(<Main/>, app);