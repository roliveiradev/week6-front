import React, { Component } from 'react';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone';
import api from '../../services/api';
import io from 'socket.io-client';

import { MdInsertDriveFile } from 'react-icons/md';

import './styles.css';
import logo from '../../assets/logo.png';

class Box extends Component {
  state = { 
    box: {},
  };

  async componentDidMount() {

    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);
    this.setState({ box: response.data });
    
  }

  subscribeToNewFiles = () => {

    const box = this.props.match.params.id;
    //const socket = io("https://rroweek-backend.herokuapp.com");
    const socket = io("http://localhost.com.br:3333");
    
    
    socket.emit("connectRoom", box);

    socket.on('file', data => {
      this.setState({ box: { ...this.state.box, files: [data, ...this.state.box.files] } });
    });

    
  }

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;

      data.append('file', file);
      api.post(`boxes/${box}/files`, data);
    });
  }

  render() {
    return (
    <div id="box-container">
      <header>
      <img src={logo} alt="" />
      <h1>{this.state.box.title}</h1>
      </header>

      <Dropzone onDropAccepted={this.handleUpload}>
        { ({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()}/>

              <p>Arraste arquivos ou clique aqui</p>
            </div>
        )}
      </Dropzone>
      
      <ul>
        { this.state.box.files && this.state.box.files.map(file => ( 
          <li key={file._id}>
            <a className="fileInfo" href={file.url} target="_blank" rel="noopener noreferrer">
              <MdInsertDriveFile size={24} color="#A5Cfff" />
              <strong>{file.title}</strong>
            </a>
            <span>há{" "}{distanceInWords(file.createdAt, new Date(), {locale: pt})}</span>
          </li>
          ))
        }
      </ul>
    </div>
    );
  }
}

export default Box;
