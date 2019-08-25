import {Button, CircularProgress, Grid, LinearProgress, Tab, Tabs} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import {FileWithPath} from 'react-dropzone';
import {connect} from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import {ApiContextWrapper} from '../../api/context';
import {Cardpack, JsonBlackCard, JsonWhiteCard, User} from '../../api/dao';
import Api from '../../api/model/api';
import {parse, stringify} from '../../helpers/cardpackFileHandler';
import FileUploaderDialog from '../FileUploaderDialog';
import CAHBlackCard from '../shells/CAHBlackCard';
import CAHWhiteCard from '../shells/CAHWhiteCard';
import TabbedList from '../TabbedList';
import CardAdder from './CardAdder';

interface CardpackViewerProps {
  api: Api;
  cardpackId: string;
  user: User;
}

interface CardpackViewerState {
  newCardName: string;
  newCardType: string; // TODO - Change to ENUM
  newCardAnswerFields: number;
  cardpack: Cardpack;
  slideIndex: number;
  isUploading: boolean;
  showUploadDialogBox: boolean;
}

class CardpackViewer extends Component<CardpackViewerProps, CardpackViewerState> {

  private static convertFileToCardpackData(file: FileWithPath) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsText(file);
    })
      .then(parse);
  }
  constructor(props: CardpackViewerProps) {
    super(props);
    this.addWhiteCards = this.addWhiteCards.bind(this);
    this.addBlackCards = this.addBlackCards.bind(this);
    this.downloadStringifiedCards = this.downloadStringifiedCards.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      newCardName: '',
      newCardType: 'white',
      newCardAnswerFields: 1,
      cardpack: undefined,
      slideIndex: 0,
      isUploading: false,
      showUploadDialogBox: false
    };

    this.openUploadDialog = this.openUploadDialog.bind(this);
    this.closeUploadDialog = this.closeUploadDialog.bind(this);

    this.fetchCurrentCardpack();
  }

  public render() {
    if (this.state.cardpack === null) {
      return (
        <div className='panel'>Cardpack does not exist</div>
      );
    }

    const isOwner = this.props.user &&
      this.state.cardpack &&
      this.state.cardpack.owner &&
      this.props.user.id === this.state.cardpack.owner.id;

    return (
      <div className='panel'>
        {this.state.cardpack ?
          <div>
            <div className='center'>{this.state.cardpack.name}</div>
            <Grid container spacing={8}>
              <Grid item xs={8}>
                {isOwner && <CardAdder
                  addCard={(cardData) => {
                    cardData.type === 'white' ?
                      this.addWhiteCards([{text: cardData.text}])
                      :
                      this.addBlackCards([
                        {
                          text: cardData.text,
                          answerFields: cardData.answerFields
                        }
                      ]);
                  }}
                  type={this.state.slideIndex ? 'black' : 'white'}
                />}
              </Grid>
              <Grid item xs={4}>
                {this.state.cardpack &&
                  <div>
                    <Button
                      style={{margin: '2px'}}
                      variant={'outlined'}
                      onClick={this.downloadStringifiedCards}
                    >
                      Download
                    </Button>
                    {
                      isOwner &&
                      <div style={{display: 'inline'}}>
                        <Button
                          style={{margin: '2px'}}
                          variant={'outlined'}
                          disabled={this.state.isUploading}
                          onClick={this.openUploadDialog}
                        >
                          Upload
                        </Button>
                        <FileUploaderDialog
                          titleText={'Upload cardpack *.txt file'}
                          type={'text/*'}
                          onUpload={this.handleUpload}
                          onClose={this.closeUploadDialog}
                          isVisible={this.state.showUploadDialogBox}
                        />
                      </div>
                    }
                  </div>
                }
                {this.state.isUploading && <CircularProgress/>}
              </Grid>
            </Grid>
            <div>
              <Tabs
                onChange={this.handleTabChange}
                value={this.state.slideIndex}
              >
                <Tab label='White Cards'/>
                <Tab label='Black Cards'/>
              </Tabs>
              <SwipeableViews
                onChangeIndex={this.handleTabChange}
                index={this.state.slideIndex}
              >
                <TabbedList>
                  {this.state.cardpack.whiteCards.map((card, index) =>
                    <CAHWhiteCard
                      key={index}
                      card={card}
                      isOwner={isOwner}
                      onDelete={(cardId) => this.setState({
                        cardpack: {
                          ...this.state.cardpack,
                          whiteCards: this.state.cardpack.whiteCards.filter(
                            (card) => card.id !== cardId
                          )
                        }
                      })}
                    />
                  )}
                </TabbedList>
                <TabbedList
                  columns={3}
                  itemsPerTab={12}
                >
                  {this.state.cardpack.blackCards.map((card, index) =>
                    <CAHBlackCard
                      key={index}
                      card={card}
                      isOwner={isOwner}
                      onDelete={(cardId) => this.setState({
                        cardpack: {
                          ...this.state.cardpack,
                          blackCards: this.state.cardpack.blackCards.filter(
                            (card) => card.id !== cardId
                          )
                        }
                      })}
                    />
                  )}
                </TabbedList>
              </SwipeableViews>
            </div>
          </div>
          :
          <LinearProgress/>}
      </div>
    );
  }

  private openUploadDialog() {
    this.setState({showUploadDialogBox: true});
  }

  private closeUploadDialog() {
    this.setState({showUploadDialogBox: false});
  }

  private fetchCurrentCardpack() {
    this.props.api.main.getCardpack(this.props.cardpackId)
      .then((cardpack) => {
        this.setState({cardpack});
      })
      .catch(() => {
        this.setState({cardpack: null});
      });
  }

  private addWhiteCards(cards: JsonWhiteCard[]) {
    return this.props.api.main.createWhiteCards(this.props.cardpackId, cards).then((createdCards) => {
      this.setState({
        cardpack: {
          ...this.state.cardpack,
          whiteCards: [
            ...this.state.cardpack.whiteCards,
            ...createdCards
          ]
        }
      });
      return createdCards;
    });
  }

  private addBlackCards(cards: JsonBlackCard[]) {
    return this.props.api.main.createBlackCards(this.state.cardpack.id, cards).then((createdCards) => {
      this.setState({
        cardpack: {
          ...this.state.cardpack,
          blackCards: [
            ...this.state.cardpack.blackCards,
            ...createdCards
          ]
        }
      });
      return createdCards;
    });
  }

  private downloadStringifiedCards() {
    const download = (filename: string, text: string) => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
    // Start file download.
    download(this.state.cardpack.name, stringify({
      whiteCards: this.state.cardpack.whiteCards,
      blackCards: this.state.cardpack.blackCards
    }));
  }

  private async handleUpload(
    acceptedFiles: FileWithPath[],
    rejectedFiles: FileWithPath[],
    event: React.DragEvent<HTMLDivElement>
  ) {
    if (acceptedFiles.length === 1 && rejectedFiles.length === 0) {
      this.closeUploadDialog();
      const file = acceptedFiles[0];
      const {whiteCards, blackCards} = await CardpackViewer.convertFileToCardpackData(file);
      this.setState({isUploading: true}, () => {
        Promise.all([
          this.addWhiteCards(whiteCards),
          this.addBlackCards(blackCards)
        ]).then(() => this.setState({isUploading: false}));
      });
    }
  }

  private handleTabChange(_: any, value: number) {
    this.setState({slideIndex: value});
  }
}

const ContextLinkedCardpackViewer = ApiContextWrapper(CardpackViewer);

const mapStateToProps = ({global: {user}}: any) => ({user});

export default connect(mapStateToProps)(ContextLinkedCardpackViewer);
