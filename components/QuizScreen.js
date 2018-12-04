import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, TouchableHighlight, Dimensions, Modal, Image } from 'react-native';
import { Font } from 'expo';

import { AVEDGE_API_KEY, GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_CX } from '../db';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class QuizScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
          fontLoaded: false,
          wrongVisible: false,
          correctVisible: false,
          mainVisible: true,
          answerName: '',
          icao: this.props.navigation.getParam('icao', 'NO ICAO'),
          questions:[],
        }
        this.setCorrectVisible = this.setCorrectVisible.bind(this);
        this.setWrongVisible = this.setWrongVisible.bind(this);
        this.setMainVisible = this.setMainVisible.bind(this);

    }
    static navigationOptions = { header: null }

    async componentDidMount() {
        await Font.loadAsync({
            'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
            'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });

        this.getAircraftImage();
    }

    componentWillMount() {
        this.getAnswers()
    }

    setCorrectVisible() {
        this.setState({correctVisible: true});
    }
    setWrongVisible() {
        this.setState({wrongVisible: true});
    }
    setMainVisible() {
        this.setState({mainVisible: false});
    }

    getAircraftImage() {
        console.log('quiz on \'' + this.state.icao + '\'');
        fetch('https://aviation-edge.com/v2/public/airplaneDatabase?key=' + AVEDGE_API_KEY + '&hexIcaoAirplane=' + this.state.icao)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response && response.length && !("error" in response)) {
                let productionLine = response[0].productionLine;
                console.log(productionLine);
                fetch(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${productionLine}&num=1&searchType=image`)
                .then((response2) => response2.json())
                .then((response2) => {
                    if (response2) {
                        console.log(response2.items[0].image.thumbnailLink);
                        this.setState({aircraftImageURL: response2.items[0].image.thumbnailLink});
                    }
                })
            }
            else {
                console.log('fallback');
                this.setState({aircraftImageURL: 'https://cdn0.iconfinder.com/data/icons/airplane-safety/512/xxx034-2-512.png'});
            }
        })
    }
  
    getAnswers() {
        const { navigation } = this.props;
        const answers = navigation.getParam('answers', 'no answers');
        this.state.questions.push(answers['correct'][0])
        for(i = 0; i < 3; i++){

            this.state.questions.push(Math.round( (Math.random() * 1000) * 10 ) / 10)
  
        }
        this.state.questions.sort(() => Math.random() - 0.5);
    }

    saveToCollection = () =>{
        for(let i = 0; i < fetchItems.length; i++){
            if(fetchItems[i].accountInfo.username == userInfo.accountInfo.username){
                if(fetchItems[i].collections == "null"){
                    addCollections(
                        i
                    ,{
                        key:'4',
                        name: 'Plane 1',
                        date_collected: '2018-11-24',
                        location: 'I wish i was in antartica',
                        image: 'https://media.wired.com/photos/5b3ac9899a7504731f8818f8/master/pass/Quiet-NASA-Transpo.jpg'
                    })
                }else{
                    addCollections(userInfo.accountInfo.username, String(fetchItems[i].collections.length),
                        {
                            key:String(fetchItems[i].collections.length),
                            name: 'Plane 1',
                            date_collected: '2018-11-24',
                            location: 'I wish i was in antartica',
                            image: 'https://media.wired.com/photos/5b3ac9899a7504731f8818f8/master/pass/Quiet-NASA-Transpo.jpg'
                        }
                    );
                }
                
            }
        }

        this.setState({correctVisible: false})

        this.props.navigation.navigate('Collection', {
            name: 'Plane 1',
            date_collected: '2018-11-24',
            location: 'I wish i was in antartica',
            image: 'https://media.wired.com/photos/5b3ac9899a7504731f8818f8/master/pass/Quiet-NASA-Transpo.jpg'
        });
    }
  
    render() {  
        const { navigation } = this.props;
        const answers = navigation.getParam('answers', 'no answers');
        const name = navigation.getParam('callsign', 'no name');
        const lat = navigation.getParam('lat', 'no lat');
        const long = navigation.getParam('long', 'no long');
        const picture = navigation.getParam('picture', 'no picture');
        return (
            <View>
            {
                this.state.fontLoaded ? (
                
                <View style={styles.container}>
                <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.mainVisible}
                        onRequestClose={ () => {this.setState({mainVisible: false})}}
                    >
                    <Text style={styles.title}>How high is the plane?</Text>

                    <View style={styles.aircraftView}>
                        <Image 
                            source={{uri: this.state.aircraftImageURL}}
                            style={styles.aircraftImage}
                        />
                    </View>

                    <View style={styles.answerButtons}>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => {
                                if (this.state.questions[0] == answers['correct'][0]){
                                    this.setCorrectVisible()
                                } else {
                                    this.setWrongVisible()
                                }
                                
                                this.setMainVisible()
                                this.state.answerName = this.state.questions[0]
                              
                            }}
                            >
                            <Text style={styles.buttonText}>{this.state.questions[0]}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => {
                                if (this.state.questions[1] == answers['correct'][0]){
                                    this.setCorrectVisible()
                                } else {
                                    this.setWrongVisible()
                                }
                                this.state.answerName = this.state.questions[1]
                                
                                this.setMainVisible()
                                
                            
                              
                            }}
                            >
                            <Text style={styles.buttonText}>{this.state.questions[1]}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => {
                                this.state.answerName = this.state.questions[2]
                                if (this.state.questions[2] == answers['correct'][0]){
                                    this.setCorrectVisible()
                                } else {
                                    this.setWrongVisible()
                                }
                                this.setMainVisible()

                              
                            }}
                            >
                            <Text style={styles.buttonText}>{this.state.questions[2]}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.button}
                            onPress={() => {
                                if (this.state.questions[3] == answers['correct'][0]){
                                    this.setCorrectVisible()
                                } else {
                                    this.setWrongVisible()
                                }
                                this.state.answerName = this.state.questions[3]
                               
                                this.setMainVisible()
                              
                            }}
                            >
                            <Text style={styles.buttonText}>{this.state.questions[3]}</Text>
                        </TouchableHighlight>
                   
                   
                    </View>
                     </Modal>

                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.correctVisible}
                        onRequestClose={ () => {this.setState({correctVisible: false})}}
                    >
                    <View>
                                <Text style={styles.title}> Correct! </Text>
                                <Image source={{uri: 'https://media.wired.com/photos/5b3ac9899a7504731f8818f8/master/pass/Quiet-NASA-Transpo.jpg'}} style={styles.planeImage}/>
                                <Text style={styles.text}>Would you like to add the plane to your hangar?</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableHighlight
                                        style={[styles.button]}
                                        onPress={()=>{
                                            this.setState({correctVisible: false})
                                            this.props.navigation.navigate('Collection', {
                                            name: name,
                                            date_collected: new Date().format('m-d-Y'),
                                            location: lat + ' ' + long,
                                            image: picture
                                
                                        })
                                        
                                        }}>
                                        <Text style={styles.buttonText}> Yes </Text>
                                    </TouchableHighlight>

                                    <TouchableHighlight
                                        style={[styles.button]}
                                       
                                        onPress={()=>{
                                            this.setState({correctVisible: false})
                                            this.props.navigation.navigate('Collection');
                                            
                                        }}>
                                        <Text style={styles.buttonText}> No </Text>
                                    </TouchableHighlight>

                                </View>
                            </View>

                    </Modal>

                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.wrongVisible}
                        onRequestClose={ () => {this.setState({wrongVisible: false})}}
                      >
                      <View>
                                <Text style={styles.title}> Wrong! </Text>
                                <View style={styles.planeImage}></View>
                                <Text style={styles.text}>The plane was not {this.state.answerName}m high!</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableHighlight
                                    
                                        style={[styles.button]}
                                        
                                        onPress={()=>{this.props.navigation.navigate('Collection')
                                    this.setState({wrongVisible: false})}}>
                                        <Text style={styles.buttonText}> Hangar </Text>
                                    </TouchableHighlight>

                                    <TouchableHighlight
                                     
                                        style={[styles.button]}
                                       
                                        onPress={()=>{this.props.navigation.navigate('Map');
                                    this.setState({wrongVisible: false})}}>
                                        <Text style={styles.buttonText}> Map </Text>
                                    </TouchableHighlight>

                                </View>
                            </View>

                      </Modal>

                </View>
                ) : null
            
            }

            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor:'#E2E2E2',
        height:height,
        justifyContent:'flex-start',

    },
    title: {
        fontFamily: 'Nunito-Bold',
        color: '#625E5E',
        fontSize: 25,
        margin: 30,
        justifyContent: 'flex-start',
    },
    answerButtons: {
        justifyContent:'flex-end',
        marginTop:'auto',
        marginBottom:20,
        alignSelf:'center',
        
        width:width/1.1,
        height:height/3.5,
        flexDirection:'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',

    },
    button: {
        backgroundColor:'#625E5E',
        width:'45%',
        borderWidth:7,
        borderColor: "white",
        borderRadius:50,
        height:'45%',
        margin: 5,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText: {
        fontSize:20,
        fontFamily: 'Nunito-Bold',
        color: 'white',
        justifyContent:'center',
        alignSelf:'center'
    },
    planeImage: {
        width:width/1.3,
        height:width/1.3,
        backgroundColor:'white',
        borderRadius:width/2.7,
        alignSelf:'center'
    },
    answerButton: {
        width:120,
        height:70,
        borderWidth:7,
        borderColor: "white",
        borderRadius:50,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#625E5E',
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'flex-end',
    
    },
    buttonText: {
        fontSize:20, 
        color:'white',
        fontFamily: 'Nunito-Bold',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'Nunito-Bold',
        color: '#625E5E',
        fontSize: 20,
        margin: 30,
        justifyContent: 'flex-start',
    },
    buttonContainer: {
        justifyContent:'flex-end',
        marginTop:'auto',
        marginBottom:20,
        alignSelf:'center',
        flexDirection:'row',
        width:width/1.1,
        height:height/3.5,
        flexDirection:'row',
        
        justifyContent: 'space-between',
    },
    aircraftView: {
        top: 0,
        width: width,
        height: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    aircraftImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
});