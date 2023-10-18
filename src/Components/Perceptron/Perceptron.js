import React, {useEffect, useRef, useState} from 'react';
import { io } from 'socket.io-client'
import PerceptronVisualising from "../PerceptronVisualising/PerceptronVisualising";

const Perceptron = () => {
    const [weights, setWeights] = useState(0)
    const [bias, setBias] = useState(0)
    const [trainingData, setTrainingData] = useState({'x_train': [], 'y_train': []})
    const [isConnected, setIsConnected] = useState(true)
    const socketRef = useRef()

    useEffect(() => {
        socketRef.current = io('http://127.0.0.1:5000')

        socketRef.current.emit('start_training')

        socketRef.current.on('initial_data', (data) => {
            console.log('initial data - ', data);
            setTrainingData({'x_train': data.x_train, 'y_train': data.y_train})
            // here I can init plot or other interface with initial data
        })

        socketRef.current.on('update_data', (data) => {
            setWeights(data.weights)
            setBias(data.bias)
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };

    }, [])


    const handleDisconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            setIsConnected(false);
        }
    };

    const handleConnect = () => {
        if (!socketRef.current) {
            socketRef.current = io('http://127.0.0.1:5000');
        }
        setIsConnected(true);
    };


    return (
        <div>
            perceptron component
            <h1>BIAS: {bias}</h1>
            <h1>Weights: {weights}</h1>

            {isConnected ? (
                <button onClick={handleDisconnect}>Disconnect from Socket</button>
            ) : (
                <button onClick={handleConnect}>Connect to Socket</button>
            )}

            <div>
                <PerceptronVisualising bias={bias} data={trainingData.x_train} weights={weights} />
            </div>
        </div>
    );
};

export default Perceptron;