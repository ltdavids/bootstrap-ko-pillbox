# bootstrap-ko-pillbox-[Demo](http://ltdavids.github.io/bootstrap-ko-pillbox/index)
A multi-select knockout component that plays nice with bootstrap.

##**This is a work in progress.  Consideration for backward compatibility etc is not given at this time. **

## [Examples](http://http://ltdavids.github.io/bootstrap-ko-pillbox/examples)
## Usage
```
        ko.components.register('pillbox', {
            viewModel: { require: 'pillbox' },
            template: { require: 'text!../../src/pillbox.html' }
        });
```
```html
<pillbox
    params="optionValues:Movies, selectedOptions:SelectedMovies, optionsText:'text'">
</pillbox>
```
## Dependencies
- jQuery
- Bootstrap
- RequireJs