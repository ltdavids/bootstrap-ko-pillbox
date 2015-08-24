# bootstrap-ko-pillbox-[Demo](http://ltdavids.github.io/bootstrap-ko-pillbox/index)
A multi-select knockout component that plays nice with bootstrap.

###**This is a work in progress.  Consideration for backward compatibility etc is not given at this time. **

If you decide to use it let me know and I will be more considerate when making sweeping changes.

## [Examples](http://http://ltdavids.github.io/bootstrap-ko-pillbox/examples)
## Usage

```javascript

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