# granular
> React granular synthesis engine

## example
https://ruebel.github.io/granular/

## installation
```npm install granular```

## usage
```js
import Granular from 'granular';

class MyComponent extends React.Component {
  state = {
    buffer: null,
    context: null
  };

  componentWillMount() {
    const context = getContext();
    this.setState({
      context
    });
  }

  render() {
    return (
      <Granular
        // Audio File Buffer
        buffer={this.state.buffer}
        // Audio Context
        context={this.state.context}
        // (Optional) if you want to output to a Gain node
        // rather than to the AudioContext
        output={null}
        // Output gain amount (0 - 1)
        gain={0.6},

        // Grain attack (ms)
        attack={20}
        // Grain sustain (ms)
        sustain={100}
        // Grain release (ms)
        release={20}

        // Grain density (grains / sec)
        density={0.1},
        // Pan spread amount (0 - 1)
        pan={1}
        // Grain playback rate
        playbackRate={1}
        // Grain start position in file(0 - 1)
        position={0.5}
        // Random +/- offset that will be applied to position
        spread={0.2}

        // On (true) - Off (false)
        run={false}
      />
    );
  }
}

export default MyComponent;
```

## license
MIT © [Randy Uebel](randy.uebel@gmail.com)
