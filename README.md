# ng2-ago
ng2-ago is a Angular 2 Pipe that makes it easy to support automatically updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").

# Installation
1. Install package with npm:
````
npm  install ng2-ago --save 
````
2. Add pipe to your module:
```
import { TimeAgoPipe } from 'ng2-ago';
@NgModule({
    ...
    providers: [TimeAgoPipe, ...]
    ...
})
```

# Usage
Basic:
````
{{ yourDateElement | ago }}
````

Set max period time (default: 86400000ms):
````
{{ yourDateElement | ago:86400000 }}
````

Set max period time (default: 86400000ms) and date format (default: `medium`):
````
{{ yourDateElement | ago:86400000:medium }}
````