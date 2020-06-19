
/**
 * Search terms
 */ 
import { Injectable, Pipe } from '@angular/core';
 
@Pipe({
  name: 'search',
  pure: true
})
@Injectable()
export class SearchPipe {
  transform(list, searchTerm: string) {
    if (searchTerm) {
      searchTerm = searchTerm.toUpperCase();
      
      return list.filter(item => {
        if(item.Searchable__c) return item.Searchable__c.toUpperCase().indexOf(searchTerm) !== -1;
        else if(item.Contact && item.Contact.Searchable__c) return item.Contact.Searchable__c.toUpperCase().indexOf(searchTerm) !== -1;
        else if(item.Sponsor_Name__c) return item.Sponsor_Name__c.toUpperCase().indexOf(searchTerm) !== -1;
        else if(item.Name) return item.Name.toUpperCase().indexOf(searchTerm) !== -1;

        else return false;
      });
    } else {
      return list;
    }
  }
}