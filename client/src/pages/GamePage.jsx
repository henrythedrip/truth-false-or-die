import React from 'react'
import GameItem from '../components/GameItem'
import GameWindow from '../components/GameWindow'

import { useState, useEffect } from 'react'
import { USER_ANSWERS } from '../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_SCORE } from '../utils/mutations';



// we need to do something similar to challenge 4... we had a variable that was a current question, now we are going to use the useState instead of a variable ... once they answer the question, we change the value of the current question with the set current question to the next value... we should do the randomization of the questions in the backend .. return only the questions that we need from the backend in a random order. 
// we also need to add a timer, similar to challenge 4...
// we shouldn't pass the answers to the front end ... the server should keep the answers a secret and the server should check the question ... we need to think about the server as the part that is going to take on the work and the front end is a dumb program that doesn't have the answers. Front end should not know the business logic.


/*
these are question objects sent from the client to the backend, the backend first finds the question by its id, and then checks if the answer provided by the user matches the answer in the database
[
    {
        questionId: "098765",
        answer: false
    },
    {
        questionId: "123456",
        answer: true
    },
    {...}
] -> Mutation
 
BackEnd: typedefs: 
 input Answer {
    question: ID!
    answer: Boolean! 
}
submitAnswer([Answer]): Int

in resolver you could do a Question.findById()

FrontEnd: MUTATION`
mutation submitAnswer($answers: [Answer]!) {
  submitAnswer(answers: $answers)
}`
*/








const GamePage = () => {

    const [gameId, setGameId] = useState('animal')
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [scoreSubmit, setScoreSubmit] = useState([]);
    const [scoreValue, setScoreValue] = useState(null);

    const [submitAnswers] = useMutation(USER_ANSWERS);
   
    // for picking category
    const [category, setCategory] = useState(null);
console.log(userAnswers.length,'banana')
    function clickHandler(e) {
        let answer = true;
        setCurrentQuestion(currentQuestion + 1)
        const question = localStorage.getItem('question');
        if(e.target.value === 'true'){
            answer = true;
        }else{answer = false;}
         
                if(userAnswers.length === 10){
            endGame()
        }
        console.log(userAnswers);
        return setUserAnswers([
            ...userAnswers,
            {question: question, answer: answer }
        ]);

    }

    function chooseCategory(category) {
        // console.log(category)
        switch (category) {
            case "animal":
                setCategory('Animals')
                console.log(category);
                break;

            case "death":
                setCategory('Death')
                console.log(category);
                break;

            case "food":
                setCategory('Food')
                console.log(category);
                break;

            case "game":
                setCategory('Game')
                console.log(category);
                break;

            case "general":
                setCategory('General')
                console.log(category);
                break;

            case "history":
                setCategory('History')
                console.log(category);
                break;

            case "law":
                setCategory('Law')
                console.log(category);
                break;

            case "sports":
                setCategory('Sports')
                console.log(category);
                break;

            // default:
            //     console.log('this is the default page')
            //     setCategory(null)
            //     break;

        }
    }
console.log('what',userAnswers.question)
    const endGame = async () => {
        try{
        const response = await submitAnswers({
            variables: {answers: userAnswers}
        })
        if(!response){
            console.log('no score')
        }
        const score = await response.data.submitAnswers
console.log(score,'wbft')
setScoreSubmit(score)
setCategory(null)
setScoreValue('score')
    }catch(err){console.error(err)}
      }
const scoreRender = () => {
return <div>
    <h2>Number of Questions: {scoreSubmit.questionCount} Correct Questions: {scoreSubmit.correct}</h2>
</div>
}



    // we need to learn how useLazyQuery works before we try to use it
    // const [singleCategory, { loading, error, data }] = useLazyQuery(QUERY_SINGLE_CATEGORY)
    // useEffect(() => {
    //     // TODO: this should call the getGame query
    //     // singleCategory({
    //     //     variables: {
    //     //         id: gameId
    //     //     }
    //     // })
    // }, [gameId])
    return (

        <div>
            <div className='game-header'>
                <h2>Choose A Category</h2>
            </div>
            <div className='game-selection'>
                <GameItem onClick={() => chooseCategory('animal')} gameName="Animals" />
                <GameItem onClick={() => chooseCategory('death')} gameName="Death" />
                <GameItem onClick={() => chooseCategory('food')} gameName="Food" />
                <GameItem onClick={() => chooseCategory('game')} gameName="Video Games" />
                <GameItem onClick={() => chooseCategory('general')} gameName="General" />
                <GameItem onClick={() => chooseCategory('history')} gameName="History" />
                <GameItem onClick={() => chooseCategory('law')} gameName="Law" />
                <GameItem onClick={() => chooseCategory('sports')} gameName="Sports" />
            </div>
            <div className='game-window'>
                <p className='time'></p>
                {/* <h3>Here is where the question will go</h3> */}

                {category && <GameWindow category={category} questionIndex= {currentQuestion} userAnswers={userAnswers} scoreSubmit={scoreSubmit} />}

                {scoreValue && scoreRender()}
                {/* here we have to do a conditional rendering in which if the data array has data, then we build the elements for the question that corresponds to the index in the data array. the data array is the stuff we loaded from the lazy query */}
            </div>
            <div className='true-false-responses'>
                <button value='true' className='true-button' onClick={clickHandler}>True</button>

                <button value='false' className='false-button'onClick={clickHandler}>False</button>

            </div>
        </div>
    )
}

export default GamePage
